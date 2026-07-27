# Frontend Role-Based Access Control Implementation

## Overview

The frontend now has comprehensive role-based access control (RBAC) that:
- ✅ Protects dashboard pages from unauthorized access
- ✅ Handles 403 errors with automatic redirects
- ✅ Conditionally renders features based on role
- ✅ Shows loading states and error messages
- ✅ Provides role-based navigation

---

## File Structure

### New Files Created

```
frontend/src/
├── utils/
│   └── roleUtils.ts           # Role checking utilities
├── hooks/
│   ├── useRoleBasedAccess.ts  # Dashboard protection hook
│   └── useAPIErrorHandler.ts  # API error handling hook
└── components/
    └── RoleBasedComponent.tsx # Conditional rendering components
```

### Updated Files

```
frontend/src/
├── utils/
│   └── api.ts                                          # Added isUnauthorized flag
├── pages/dashboard/
│   ├── AdminDashboard/AdminDashboard.tsx              # Added role checking
│   ├── TechnicianDashboard/TechnicianDashboard.tsx    # Added role checking
│   └── CustomerDashboard/CustomerDashboard.tsx        # Added role checking
```

---

## How It Works

### 1. Role Utilities (`roleUtils.ts`)

Provides functions to check roles and permissions:

```typescript
import {
  getCurrentUserRole,
  isAdmin,
  isTechnician,
  isCustomer,
  hasRole,
  hasAnyRole,
  canAccessDashboard,
  FeatureAccess,
  getDashboardRouteForRole,
} from '@/utils/roleUtils';

// Check current role
const role = getCurrentUserRole(); // 'admin' | 'technician' | 'customer' | null

// Check specific role
if (isAdmin()) {
  // Admin logic
}

// Check for multiple roles
if (hasAnyRole('admin', 'technician')) {
  // Admin or technician logic
}

// Check if can access dashboard
if (canAccessDashboard('admin')) {
  // Allowed
}

// Feature visibility
if (FeatureAccess.manageUsers()) {
  // Show manage users button
}

// Get dashboard for role
const dashboardRoute = getDashboardRouteForRole('technician');
// Returns: '/technician-dashboard'
```

### 2. Role-Based Access Hook (`useRoleBasedAccess.ts`)

Protects dashboard pages and enforces role access:

```typescript
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthorized, isLoading, error } = useRoleBasedAccess({
    requiredRole: 'admin',
    onUnauthorized: () => {
      navigate('/customer-dashboard', { replace: true });
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthorized) return <AccessDenied error={error} />;

  return <AdminContent />;
}
```

### 3. Role-Based Components (`RoleBasedComponent.tsx`)

Conditionally render content based on role:

```typescript
import {
  RoleBasedComponent,
  AdminOnly,
  TechnicianOnly,
  FeatureVisibility,
  AdminOrTech,
} from '@/components/RoleBasedComponent';

// Conditional rendering for admin
<AdminOnly>
  <ManageUsersButton />
</AdminOnly>

// Conditional rendering for multiple roles
<RoleBasedComponent requiredRole={['admin', 'technician']}>
  <ManagementPanel />
</RoleBasedComponent>

// Feature-based conditional rendering
<FeatureVisibility feature="assignBookings">
  <AssignBookingButton />
</FeatureVisibility>

// Using shorthand components
<TechnicianOnly>
  <AcceptJobButton />
</TechnicianOnly>

<AdminOrTech>
  <JobManagement />
</AdminOrTech>
```

### 4. API Error Handler (`useAPIErrorHandler.ts`)

Centralized error handling for API requests:

```typescript
import { useAPIErrorHandler } from '@/hooks/useAPIErrorHandler';

function MyComponent() {
  const { error, clearError, handleError } = useAPIErrorHandler();

  const fetchData = async () => {
    try {
      const data = await apiGet('/protected/endpoint/');
    } catch (err) {
      handleError(err);
      // Automatically handles:
      // - 401: Clears session, redirects to login
      // - 403: Redirects to appropriate dashboard
      // - 429: Sets rate limit state for display
    }
  };

  return (
    <>
      {error.message && (
        <ErrorMessage
          message={error.message}
          isRateLimit={error.isRateLimit}
          isUnauthorized={error.isUnauthorized}
        />
      )}
    </>
  );
}
```

---

## Usage Patterns

### Pattern 1: Protecting a Dashboard Page

```typescript
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthorized, isLoading, error } = useRoleBasedAccess({
    requiredRole: 'admin',
    onUnauthorized: () => {
      navigate('/customer-dashboard', { replace: true });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>{error}</p>
      </div>
    );
  }

  return <AdminContent />;
}
```

### Pattern 2: Conditionally Showing Features

```typescript
import { AdminOnly, TechnicianOnly, FeatureAccess } from '@/utils/roleUtils';

function Navigation() {
  return (
    <nav>
      <a href="/dashboard">Dashboard</a>

      <AdminOnly>
        <a href="/admin/users">Manage Users</a>
        <a href="/admin/reports">Reports</a>
      </AdminOnly>

      <TechnicianOnly>
        <a href="/tech/jobs">Available Jobs</a>
      </TechnicianOnly>

      {FeatureAccess.viewProfile() && (
        <a href="/profile">Profile</a>
      )}
    </nav>
  );
}
```

### Pattern 3: API Error Handling

```typescript
import { useAPIErrorHandler } from '@/hooks/useAPIErrorHandler';
import { apiGet, APIError } from '@/utils/api';

function UserList() {
  const { error, handleError, clearError } = useAPIErrorHandler();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await apiGet<{ users: any[] }>('/admin/users/');
        setUsers(data.users);
      } catch (err) {
        handleError(err);
        // If 403: Redirects to customer dashboard
        // If 401: Clears session and redirects to login
      }
    };

    loadUsers();
  }, []);

  return (
    <>
      {error.isUnauthorized && (
        <div style={{ color: 'red' }}>
          You don't have permission to view this page
        </div>
      )}
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </>
  );
}
```

### Pattern 4: Role Hierarchy

```typescript
import { hasRoleLevel } from '@/utils/roleUtils';

function PaymentManagement() {
  // Only admin and above (admin level = 3, tech level = 2)
  if (!hasRoleLevel('admin')) {
    return <div>Access Denied</div>;
  }

  return <PaymentPanel />;
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 200 | Success | Process response |
| 400 | Bad Request | Show validation error |
| 401 | Unauthorized | Clear tokens, redirect to login |
| 403 | Forbidden (Wrong Role) | Redirect to appropriate dashboard |
| 429 | Rate Limited | Show countdown timer, disable form |
| 500 | Server Error | Show error message |

### Error Response Examples

**401 Unauthorized (Not Authenticated)**

```json
HTTP 401 Unauthorized
{
  "ok": false,
  "message": "Authentication required."
}
```

Frontend handling:
```typescript
try {
  await apiGet('/protected/endpoint/');
} catch (error) {
  if (error instanceof APIError && error.statusCode === 401) {
    // useAPIErrorHandler automatically:
    // 1. Clears localStorage tokens
    // 2. Redirects to /login
    handleError(error);
  }
}
```

**403 Forbidden (Wrong Role)**

```json
HTTP 403 Forbidden
{
  "ok": false,
  "message": "Access denied. This endpoint requires one of the following roles: admin."
}
```

Frontend handling:
```typescript
try {
  await apiGet('/admin-dashboard/');
} catch (error) {
  if (error instanceof APIError && error.isUnauthorized) {
    // useAPIErrorHandler automatically:
    // 1. Detects it's a 403 (isUnauthorized = true)
    // 2. Gets current user's dashboard route
    // 3. Redirects to /customer-dashboard (or appropriate)
    handleError(error);
  }
}
```

---

## Complete Example

Here's a complete example of a protected admin component with feature visibility:

```typescript
import React, { useState, useEffect } from 'react';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { useAPIErrorHandler } from '@/hooks/useAPIErrorHandler';
import { AdminOnly, FeatureVisibility } from '@/components/RoleBasedComponent';
import { apiGet, apiPost } from '@/utils/api';
import { useNavigate } from 'react-router-dom';

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check role-based access
  const { isAuthorized, isLoading: roleLoading } = useRoleBasedAccess({
    requiredRole: 'admin',
    onUnauthorized: () => navigate('/customer-dashboard', { replace: true }),
  });

  // Handle API errors
  const { error, handleError } = useAPIErrorHandler();

  // Load users
  useEffect(() => {
    if (!isAuthorized) return;

    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const data = await apiGet<{ users: any[] }>('/admin/users/');
        setUsers(data.users);
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [isAuthorized]);

  // Show loading while checking authorization
  if (roleLoading) {
    return <div>Verifying permissions...</div>;
  }

  // Show error if not authorized
  if (!isAuthorized) {
    return <div>Access Denied</div>;
  }

  // Handle API errors
  if (error.isUnauthorized) {
    return <div>You don't have permission to manage users</div>;
  }

  return (
    <div>
      <h1>User Management</h1>

      {/* Only show delete feature for admins */}
      <FeatureVisibility feature="manageUsers">
        <button onClick={() => {}}>Add User</button>
      </FeatureVisibility>

      {isLoading ? (
        <div>Loading users...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {/* Only show delete for admins */}
                  <AdminOnly>
                    <button onClick={() => {}}>Delete</button>
                  </AdminOnly>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserManagement;
```

---

## Testing

### Test Role-Based Access

**Test 1: Admin accessing admin dashboard**
```
1. Login as admin
2. Navigate to /admin-dashboard
3. Expected: Should load admin dashboard
```

**Test 2: Customer accessing admin dashboard**
```
1. Login as customer
2. Try to navigate to /admin-dashboard
3. Expected: Should redirect to /customer-dashboard with 403 error
```

**Test 3: Unauthenticated accessing protected page**
```
1. Clear localStorage
2. Try to navigate to /admin-dashboard
3. Expected: Should redirect to /login
```

**Test 4: Feature visibility**
```
1. Login as customer
2. View page with AdminOnly component
3. Expected: AdminOnly content should not be visible
```

---

## Best Practices

### ✅ DO

1. Always use `useRoleBasedAccess` on protected pages
2. Use `RoleBasedComponent` or `*Only` components for conditional rendering
3. Handle all three error cases: 401 (auth), 403 (authz), 429 (rate limit)
4. Show loading state while checking authorization
5. Redirect to appropriate dashboard based on role
6. Clear localStorage on 401 errors

### ❌ DON'T

1. Trust role from URL parameter for authorization
2. Skip error handling in API calls
3. Show same error for 401 and 403
4. Hide features only in UI (always check backend)
5. Store sensitive data in localStorage
6. Reload page on 403 (redirect instead)

---

## Migration Guide

### For Existing Pages

If you have existing pages that need role-based access:

**Before:**
```typescript
function AdminPage() {
  return <AdminContent />;
}
```

**After:**
```typescript
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const navigate = useNavigate();
  const { isAuthorized, isLoading } = useRoleBasedAccess({
    requiredRole: 'admin',
  });

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthorized) return <div>Access Denied</div>;

  return <AdminContent />;
}
```

---

## Quick Reference

### Imports

```typescript
// Role checking
import {
  getCurrentUserRole,
  isAdmin,
  isTechnician,
  isCustomer,
  hasRole,
  hasAnyRole,
  FeatureAccess,
} from '@/utils/roleUtils';

// Access control hooks
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { useAPIErrorHandler } from '@/hooks/useAPIErrorHandler';

// Conditional rendering components
import {
  RoleBasedComponent,
  AdminOnly,
  TechnicianOnly,
  CustomerOnly,
  FeatureVisibility,
} from '@/components/RoleBasedComponent';

// API
import { apiGet, apiPost, APIError } from '@/utils/api';
```

### Common Checks

```typescript
// Check if admin
if (isAdmin()) { }

// Check for multiple roles
if (hasAnyRole('admin', 'technician')) { }

// Check if can manage users
if (FeatureAccess.manageUsers()) { }

// Check role level
if (hasRoleLevel('technician')) { }

// Get current role
const role = getCurrentUserRole();
```

---

**Status:** ✅ Ready for Production  
**Last Updated:** 2026-07-24
