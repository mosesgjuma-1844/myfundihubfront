# Frontend RBAC - Testing & Deployment Checklist

## ✅ Implementation Status

**Date:** 2026-07-24  
**Status:** Ready for Testing

### Files Created/Updated

**New Files:**
- ✅ `src/utils/roleUtils.ts` - Role checking utilities
- ✅ `src/hooks/useRoleBasedAccess.ts` - Dashboard protection hook
- ✅ `src/hooks/useAPIErrorHandler.ts` - API error handling
- ✅ `src/components/RoleBasedComponent.tsx` - Conditional rendering components
- ✅ `FRONTEND_RBAC_GUIDE.md` - Complete implementation guide

**Updated Files:**
- ✅ `src/utils/api.ts` - Added `isUnauthorized` flag to APIError
- ✅ `src/pages/dashboard/AdminDashboard/AdminDashboard.tsx` - Added role checking
- ✅ `src/pages/dashboard/TechnicianDashboard/TechnicianDashboard.tsx` - Added role checking
- ✅ `src/pages/dashboard/CustomerDashboard/CustomerDashboard.tsx` - Added role checking

---

## 🧪 Testing Phases

### Phase 1: Local Setup & Build (5 minutes)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies (if not already done)
npm install

# 3. Type check - ensure no TypeScript errors
npm run type-check

# 4. Build - ensure production build works
npm run build

# 5. Start dev server
npm run dev
```

**Expected Results:**
- ✅ No npm install errors
- ✅ No TypeScript errors
- ✅ Build succeeds without warnings
- ✅ Dev server starts on http://localhost:5173

### Phase 2: Manual Testing - Authentication Flow (10 minutes)

**Test 2.1: Login and Role Assignment**

```
1. Navigate to http://localhost:5173/login
2. Login with admin credentials:
   - Email: admin@test.com
   - Password: password123
3. Expected: Redirects to /admin-dashboard
4. Check localStorage:
   - localStorage.getItem('fundiTokens') - Should have access token
   - localStorage.getItem('fundiUser') - Should have role='admin'
```

**Test 2.2: Technician Login**

```
1. Clear browser data
2. Login with technician:
   - Email: tech@test.com
   - Password: password123
3. Expected: Redirects to /technician-dashboard
4. Check role in localStorage should be 'technician'
```

**Test 2.3: Customer Login**

```
1. Clear browser data
2. Login with customer:
   - Email: customer@test.com
   - Password: password123
3. Expected: Redirects to /customer-dashboard
4. Check role in localStorage should be 'customer'
```

### Phase 3: Manual Testing - Role-Based Access Control (15 minutes)

**Test 3.1: Admin Can Access Admin Dashboard**

```
1. Login as admin
2. Navigate to http://localhost:5173/admin-dashboard
3. Expected: Page loads successfully
4. Check: Sidebar shows admin menu items
```

**Test 3.2: Customer Cannot Access Admin Dashboard**

```
1. Login as customer
2. Manually navigate to http://localhost:5173/admin-dashboard
3. Expected: 
   - Redirects to /customer-dashboard
   - Shows "Access Denied" message briefly
   - Loading state shows while checking
```

**Test 3.3: Technician Cannot Access Admin Dashboard**

```
1. Login as technician
2. Navigate to /admin-dashboard
3. Expected: Redirects to /technician-dashboard with error
```

**Test 3.4: Unauthenticated Cannot Access Protected Pages**

```
1. Clear localStorage
2. Try to navigate to /admin-dashboard
3. Expected: Redirects to /login
```

### Phase 4: API Error Handling Testing (10 minutes)

**Test 4.1: 403 Error Handling**

```
1. Login as customer
2. Open DevTools → Console
3. Try to access admin endpoint:
   ```typescript
   import { apiGet } from '@/utils/api';
   apiGet('/admin-dashboard/').catch(e => console.log(e));
   ```
4. Expected:
   - Error with statusCode 403
   - isUnauthorized flag set to true
   - useAPIErrorHandler redirects to customer dashboard
```

**Test 4.2: 401 Error Handling**

```
1. Clear localStorage
2. Open DevTools → Console
3. Try API call without token:
   ```typescript
   import { apiGet } from '@/utils/api';
   apiGet('/protected/endpoint/').catch(e => console.log(e));
   ```
4. Expected:
   - Error with statusCode 401
   - Redirects to /login
   - Session cleared
```

### Phase 5: Component Testing (10 minutes)

**Test 5.1: AdminOnly Component**

```
1. Login as admin
2. Check if admin-only buttons are visible
3. Login as customer
4. Check if admin-only buttons are hidden
```

**Test 5.2: RoleBasedComponent**

```
1. Create test page with RoleBasedComponent
2. Set requiredRole to 'admin'
3. Login as different roles
4. Verify content shows/hides appropriately
```

**Test 5.3: FeatureVisibility Component**

```
1. Test feature="manageUsers" (admin only)
2. Login as customer: Feature hidden
3. Login as admin: Feature visible
```

### Phase 6: UI/UX Testing (10 minutes)

**Test 6.1: Loading State**

```
1. Add network throttling in DevTools (slow 3G)
2. Navigate between protected pages
3. Expected: Loading indicator shows briefly
```

**Test 6.2: Error Messages**

```
1. Try accessing wrong dashboard
2. Expected: Clear error message shown
3. Button to navigate to correct dashboard
```

**Test 6.3: Mobile Responsiveness**

```
1. View on mobile (iPhone 12 or smaller)
2. Test all role-based redirects work
3. Test conditional components render correctly
```

### Phase 7: Integration Testing (15 minutes)

**Test 7.1: Dashboard Navigation**

```
1. Login as admin
2. Click on different menu items
3. Verify all protected pages work
4. Check no 403 errors in console
```

**Test 7.2: Logout & Re-login**

```
1. Login as admin
2. Logout
3. Re-login as technician
4. Expected: Dashboard switches to technician view
5. Check localStorage has correct role
```

**Test 7.3: Session Persistence**

```
1. Login as customer
2. Refresh page (F5)
3. Expected: Stays on customer dashboard
4. Check tokens still in localStorage
```

**Test 7.4: Token Expiration**

```
1. Login and get valid token
2. Manually expire token in localStorage
3. Try to access protected endpoint
4. Expected: 401 error, redirects to login
```

---

## 📋 Deployment Checklist

### Pre-Deployment Verification

- [ ] All TypeScript files compile without errors
- [ ] No console errors in DevTools
- [ ] All tests pass
- [ ] Features conditionally render correctly
- [ ] Redirects work for all role combinations
- [ ] Error messages display properly
- [ ] Mobile responsive
- [ ] No memory leaks in React hooks

### Build & Optimization

- [ ] Run production build: `npm run build`
- [ ] Check build output size
- [ ] Verify no source maps in production
- [ ] Test performance metrics
- [ ] Verify lazy loading works (if implemented)

### Backend Verification

- [ ] Backend RBAC decorators applied to endpoints
- [ ] Backend returns correct 401/403/429 status codes
- [ ] Backend returns consistent error messages
- [ ] Rate limiting working on backend
- [ ] JWT tokens properly generated

### Frontend-Backend Integration

- [ ] Login redirects to correct dashboard
- [ ] API calls include Authorization header
- [ ] 401 errors trigger logout
- [ ] 403 errors trigger redirect
- [ ] Rate limit errors show countdown timer
- [ ] Tokens stored/retrieved correctly

### Staging Deployment

- [ ] Deploy to staging environment
- [ ] Test with staging API URL
- [ ] Verify CORS settings
- [ ] Test on actual domain (HTTPS)
- [ ] Test on multiple browsers
- [ ] Test on mobile devices

### Production Deployment

- [ ] Code review completed
- [ ] All tests passing
- [ ] Staging verification complete
- [ ] Rollback plan documented
- [ ] Monitoring set up
- [ ] Error tracking configured

---

## 🔍 Verification Tests

### Test Case 1: Role Hierarchy

| User Role | Can Access | Result |
|-----------|-----------|--------|
| Admin | Admin Dashboard | ✅ Pass |
| Admin | Technician Dashboard | ✅ Pass |
| Admin | Customer Dashboard | ✅ Pass |
| Technician | Admin Dashboard | ❌ Redirect |
| Technician | Technician Dashboard | ✅ Pass |
| Technician | Customer Dashboard | ✅ Pass |
| Customer | Admin Dashboard | ❌ Redirect |
| Customer | Technician Dashboard | ❌ Redirect |
| Customer | Customer Dashboard | ✅ Pass |

### Test Case 2: Feature Visibility

| User Role | Can See | Button Visible |
|-----------|---------|----------------|
| Admin | Manage Users | ✅ Yes |
| Admin | View Reports | ✅ Yes |
| Technician | Accept Jobs | ✅ Yes |
| Technician | View Earnings | ✅ Yes |
| Customer | Book Service | ✅ Yes |
| Customer | Search Techs | ✅ Yes |

### Test Case 3: Error Handling

| Error Type | Status Code | Frontend Action | Expected |
|-----------|-----------|-----------------|----------|
| Unauthorized | 401 | Logout & Redirect | → Login page |
| Forbidden | 403 | Get Dashboard | → Appropriate dashboard |
| Rate Limited | 429 | Show Countdown | → Retry timer shown |
| Not Found | 404 | Show Error | → Error message |
| Server Error | 500 | Show Error | → Error message |

---

## 🚀 Rollback Plan

If issues occur in production:

### Quick Rollback

```bash
# 1. Revert code to previous commit
git revert <commit-hash>

# 2. Rebuild
npm run build

# 3. Redeploy
# (Your deployment command here)
```

### Feature Flag Alternative

If you want gradual rollout:

```typescript
// Use environment variable
const USE_RBAC = import.meta.env.VITE_USE_RBAC === 'true';

if (USE_RBAC) {
  // Use new RBAC system
} else {
  // Use old system
}
```

---

## 📊 Success Criteria

All of the following must be true:

- ✅ Admin can access admin dashboard
- ✅ Technician cannot access admin dashboard
- ✅ Customer cannot access admin dashboard
- ✅ Unauthenticated users cannot access protected pages
- ✅ 401 errors redirect to login
- ✅ 403 errors redirect to appropriate dashboard
- ✅ Rate limit errors show countdown timer
- ✅ Role-based components show/hide correctly
- ✅ Loading states display properly
- ✅ Error messages are clear and helpful
- ✅ Mobile responsive
- ✅ No console errors
- ✅ Performance acceptable
- ✅ All browsers supported

---

## 📞 Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
npm install
npm run type-check
```

### Issue: Components not re-rendering after login

**Solution:** Check if `localStorage` is being updated:
```javascript
// In browser console
localStorage.getItem('fundiUser')
localStorage.getItem('fundiTokens')
```

### Issue: Always redirecting to login

**Solution:** Verify backend is returning correct tokens:
```bash
# Test login API
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```

### Issue: 403 errors not redirecting

**Solution:** Check useAPIErrorHandler is being used:
```typescript
const { handleError } = useAPIErrorHandler();
try {
  // API call
} catch (err) {
  handleError(err); // This triggers redirect
}
```

### Issue: Features showing when shouldn't

**Solution:** Ensure role is correctly set in localStorage:
```javascript
// Check role
const user = JSON.parse(localStorage.getItem('fundiUser'));
console.log(user.role);
```

---

## 📝 Testing Report Template

```markdown
# Frontend RBAC Testing Report

**Date:** [Date]
**Tester:** [Name]
**Build Version:** [Version]

## Test Results

### Phase 1: Setup ✅/❌
- Build successful: ✅
- No TypeScript errors: ✅
- Dev server running: ✅

### Phase 2: Authentication ✅/❌
- Admin login works: ✅
- Technician login works: ✅
- Customer login works: ✅

### Phase 3: Access Control ✅/❌
- Admin can access admin dashboard: ✅
- Customer blocked from admin: ✅
- Technician blocked from admin: ✅

### Phase 4: Error Handling ✅/❌
- 401 errors redirect to login: ✅
- 403 errors redirect appropriately: ✅
- 429 errors show countdown: ✅

### Phase 5: Components ✅/❌
- AdminOnly component works: ✅
- FeatureVisibility works: ✅
- RoleBasedComponent works: ✅

### Phase 6: UI/UX ✅/❌
- Loading states display: ✅
- Error messages clear: ✅
- Mobile responsive: ✅

### Phase 7: Integration ✅/❌
- Dashboard navigation works: ✅
- Logout/re-login works: ✅
- Session persistence: ✅

## Issues Found

1. [Issue #1]
2. [Issue #2]

## Recommendations

- [Recommendation #1]

## Sign-off

- Testing Lead: _________________ Date: _______
- QA Lead: _________________ Date: _______
- Release Manager: _________________ Date: _______
```

---

**Status:** Ready for Testing ✅  
**Next Steps:** Execute testing phases sequentially  
**Last Updated:** 2026-07-24
