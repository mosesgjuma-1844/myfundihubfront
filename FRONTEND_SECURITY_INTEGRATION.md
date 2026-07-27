# Frontend Security Updates - API Integration Guide

## Overview

The frontend has been updated to integrate with the new backend security features:
- JWT token-based authentication
- Rate limiting with user-friendly feedback
- Enhanced error handling
- Secure token storage and management

## New Utilities

### 1. Token Manager (`src/utils/tokenManager.ts`)

Handles all JWT token operations including storage, retrieval, validation, and refresh.

#### Key Functions

```typescript
// Store tokens from login response
storeTokens(tokens: Tokens): void

// Get access token for API requests
getAccessToken(): string | null

// Get refresh token for token renewal
getRefreshToken(): string | null

// Get both tokens
getStoredTokens(): StoredTokens | null

// Check if access token is still valid
hasValidToken(): boolean

// Clear all tokens (logout)
clearTokens(): void

// Get formatted Authorization header
getAuthorizationHeader(): string | null
```

#### Usage Example

```typescript
import * as tokenManager from '@/utils/tokenManager';

// After successful login
tokenManager.storeTokens(response.tokens);

// Before making API request
const authHeader = tokenManager.getAuthorizationHeader(); // "Bearer eyJ..."

// On logout
tokenManager.logout();
```

### 2. Updated API Utilities (`src/utils/api.ts`)

Enhanced with JWT support and better error handling.

#### New Types

```typescript
export interface Tokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  ok: boolean;
  message: string;
  role: string;
  redirect: string;
  tokens?: Tokens;        // JWT tokens
  user: UserProfile;
}

export class APIError extends Error {
  statusCode: number;
  isRateLimit: boolean;   // true if 429 error
}
```

#### API Functions

```typescript
// Generic GET with automatic JWT inclusion
apiGet<T>(path: string, includeAuth: boolean = true): Promise<T>

// Generic POST with automatic JWT inclusion
apiPost<T>(path: string, payload: unknown, includeAuth: boolean = true): Promise<T>

// Special login handler
apiLogin<T extends LoginResponse>(path: string, payload: unknown): Promise<T>
```

#### Error Handling

```typescript
try {
  const result = await apiPost('/auth/register/', userData, false);
} catch (error) {
  if (error instanceof APIError) {
    if (error.isRateLimit) {
      // Handle 429 rate limit
      console.log('Rate limited. Retry after:', calculateRetryTime());
    } else {
      // Handle other errors
      console.error('API Error:', error.message);
    }
  }
}
```

## Updated Components

### Login Component (`src/pages/auth/login/Login.tsx`)

**New Features:**
- ✅ Stores JWT tokens on successful login
- ✅ Handles rate limiting (5 attempts per 15 minutes)
- ✅ Displays countdown timer when rate limited
- ✅ Prevents form submission during rate limit
- ✅ Shows generic error messages (no user enumeration)

**Key Changes:**

```typescript
// JWT tokens automatically stored by apiLogin
const response = await apiLogin<LoginResponse>('/auth/login/', {
  email: email.trim(),
  password: password.trim(),
});

// Handle rate limiting
if (error instanceof APIError) {
  if (error.isRateLimit) {
    setRateLimitRetryTime(900); // 15 minutes
    setErrorMessage('Too many login attempts. Please try again in 15 minutes.');
  }
}
```

### Register Component (`src/pages/auth/register/Register.tsx`)

**New Features:**
- ✅ Rate limiting (10 attempts per hour)
- ✅ Better password validation feedback
- ✅ Countdown timer on rate limit
- ✅ Disabled form during submission/rate limit

**Key Changes:**

```typescript
// Use apiPost for registration
const result = await apiPost<{ ok: boolean; message: string }>(
  '/auth/register/',
  { ...data, role },
  false // No auth needed for registration
);

// Handle rate limiting
if (error.isRateLimit) {
  setRateLimitRetryTime(3600); // 1 hour
}
```

### ForgotPassword Component (`src/pages/auth/forgetpassword/ForgetPassword.tsx`)

**New Features:**
- ✅ Rate limiting (3 attempts per hour)
- ✅ Generic response (no user enumeration)
- ✅ Countdown timer when rate limited
- ✅ Better error messaging

**Key Changes:**

```typescript
// Use apiPost with rate limiting
const result = await apiPost(
  '/auth/forgot-password/',
  { email: email.trim() },
  false
);

// Handle rate limit
if (error.isRateLimit) {
  setRateLimitRetryTime(3600);
}
```

## Integration Checklist

### Before Deploying Frontend

- [ ] Run `npm install` to ensure dependencies are up to date
- [ ] Build locally: `npm run build`
- [ ] Test login with correct credentials
- [ ] Test login with incorrect credentials
- [ ] Test login 6 times rapidly (should be rate limited on 5th)
- [ ] Test registration
- [ ] Test registration with duplicate email
- [ ] Test forgot password
- [ ] Verify tokens are stored in localStorage
- [ ] Test API calls include `Authorization: Bearer` header
- [ ] Clear localStorage and verify logout works
- [ ] Test on production domain

### localStorage Structure

After successful login, the following is stored:

```javascript
// fundiTokens
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": 1690000000000  // Unix timestamp
}

// fundiUser
{
  "id": 1,
  "username": "john_doe",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "customer",
  "phoneNumber": "0712345678",
  "specialization": "",
  "yearsOfExperience": 0
}
```

## API Request Examples

### Login Request

```typescript
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (Success):**

```json
{
  "ok": true,
  "message": "Customer login accepted.",
  "role": "customer",
  "redirect": "/customer-dashboard",
  "tokens": {
    "access": "eyJhbGc...",
    "refresh": "eyJhbGc..."
  },
  "user": {
    "id": 1,
    "username": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

**Response (Rate Limited):**

```json
HTTP 429 Too Many Requests

{
  "ok": false,
  "message": "Too many attempts. Please try again later."
}
```

### Protected API Call

All API calls automatically include the JWT token:

```typescript
// Automatic header inclusion
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer eyJhbGc...'
}
```

### Making Authenticated Requests

```typescript
// Automatic JWT inclusion
const userProfile = await apiGet<UserProfile>('/auth/user?id=123');

// Manual JWT handling (if needed)
const authHeader = tokenManager.getAuthorizationHeader();
const headers = {
  'Authorization': authHeader,
  'Content-Type': 'application/json',
};
```

## Error Handling Guide

### Rate Limit Errors (429)

```typescript
try {
  await apiLogin('/auth/login/', credentials);
} catch (error) {
  if (error instanceof APIError && error.isRateLimit) {
    // Show countdown timer
    // Disable form submission
    // Display: "Too many attempts. Please try again in XX seconds."
  }
}
```

### Authentication Errors (401)

```typescript
if (error instanceof APIError && error.statusCode === 401) {
  // Invalid credentials or expired token
  // Redirect to login
  navigate('/login');
}
```

### Validation Errors (400)

```typescript
if (error instanceof APIError && error.statusCode === 400) {
  // Display validation error message
  setFormError(error.message);
}
```

### Network Errors

```typescript
if (!(error instanceof APIError)) {
  // Network connectivity issue
  setErrorMessage('Unable to reach the server. Please check your connection.');
}
```

## Rate Limiting Details

| Endpoint | Limit | Window | User Feedback |
|----------|-------|--------|---|
| Login | 5 attempts | 15 minutes | Countdown timer |
| Registration | 10 attempts | 1 hour | Countdown timer |
| Forgot Password | 3 attempts | 1 hour | Countdown timer |
| Reset Password | 5 attempts | 1 hour | Countdown timer |

## Security Best Practices

### ✅ DO

- Store tokens in localStorage after login
- Include JWT in Authorization header for protected routes
- Handle 429 errors gracefully with countdown
- Clear tokens on logout
- Validate token expiration before making requests
- Use HTTPS in production
- Rotate refresh tokens regularly

### ❌ DON'T

- Store tokens in plain text or cookies (except HTTPOnly)
- Log tokens to console in production
- Include sensitive data in localStorage
- Make API calls without checking token validity
- Hardcode API URLs (use environment variables)
- Expose error details to users
- Store passwords anywhere in the browser

## Environment Configuration

### `.env` (Frontend)

```
VITE_API_BASE_URL=https://myfundihubback-production.up.railway.app/api
```

### For Local Development

```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Token Expiration Handling

Tokens expire based on backend configuration:
- Access token: 60 minutes
- Refresh token: 7 days

**Current Implementation:** When token expires, user is redirected to login page.

**Future Enhancement:** Implement automatic token refresh before expiration:

```typescript
// Future: Add token refresh logic
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${APIDomain}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();
    if (data.access) {
      tokenManager.updateTokens({ access: data.access });
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }

  return false;
}
```

## Common Issues & Solutions

### Issue: Tokens not persisting

**Solution:** Check if localStorage is enabled:
```typescript
const isLocalStorageAvailable = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch {
    return false;
  }
};
```

### Issue: 401 errors on every request

**Solution:** Verify token is being sent:
```typescript
console.log('Auth Header:', tokenManager.getAuthorizationHeader());
```

### Issue: Form stuck after rate limit

**Solution:** Ensure countdown timer is working:
```typescript
console.log('Retry time remaining:', rateLimitRetryTime);
```

### Issue: CORS errors

**Solution:** Verify backend CORS settings and API domain:
```typescript
console.log('API Domain:', APIDomain);
```

## Testing Checklist

```typescript
// Test token storage
localStorage.getItem('fundiTokens')

// Test token retrieval
tokenManager.getAccessToken()

// Test auth header
tokenManager.getAuthorizationHeader()

// Test token expiration
tokenManager.isTokenExpired(token)

// Test logout
tokenManager.logout()
localStorage.getItem('fundiTokens') // Should be null
```

## Support

For issues or questions:
1. Check [Backend Security Documentation](../../Backend/SECURITY_IMPROVEMENTS.md)
2. Review error messages in browser console
3. Check network tab in DevTools for API responses
4. Verify backend is running and accessible

---

**Last Updated:** 2026-07-24
**Status:** ✅ Implementation Complete
