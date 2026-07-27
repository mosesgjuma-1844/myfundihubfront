/**
 * Role-based Access Control Utilities
 * 
 * Provides helper functions for role-based feature visibility
 * and access control in the frontend.
 */

export type UserRole = 'customer' | 'technician' | 'admin';

/**
 * Get the current user's role from localStorage
 */
export function getCurrentUserRole(): UserRole | null {
  try {
    const userStr = localStorage.getItem('fundiUser');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    return user.role?.toLowerCase() || null;
  } catch (error) {
    console.error('Failed to get user role:', error);
    return null;
  }
}

/**
 * Check if user is logged in
 */
export function isUserLoggedIn(): boolean {
  try {
    const tokens = localStorage.getItem('fundiTokens');
    const user = localStorage.getItem('fundiUser');
    return !!(tokens && user);
  } catch (error) {
    return false;
  }
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: UserRole): boolean {
  const currentRole = getCurrentUserRole();
  return currentRole === role;
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
  return hasRole('admin');
}

/**
 * Check if user is technician
 */
export function isTechnician(): boolean {
  return hasRole('technician');
}

/**
 * Check if user is customer
 */
export function isCustomer(): boolean {
  return hasRole('customer');
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(...roles: UserRole[]): boolean {
  const currentRole = getCurrentUserRole();
  return currentRole ? roles.includes(currentRole) : false;
}

/**
 * Get the appropriate dashboard route for the user's role
 */
export function getDashboardRouteForRole(role: UserRole | null): string {
  switch (role) {
    case 'admin':
      return '/admin-dashboard';
    case 'technician':
      return '/technician-dashboard';
    case 'customer':
      return '/customer-dashboard';
    default:
      return '/login';
  }
}

/**
 * Get the appropriate dashboard route for current user
 */
export function getCurrentUserDashboard(): string {
  const role = getCurrentUserRole();
  return getDashboardRouteForRole(role);
}

/**
 * Check if user can access a specific dashboard
 */
export function canAccessDashboard(requiredRole: UserRole): boolean {
  return hasRole(requiredRole);
}

/**
 * Role hierarchy levels (higher = more privileged)
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  'customer': 1,
  'technician': 2,
  'admin': 3,
};

/**
 * Check if user's role level is >= required level
 */
export function hasRoleLevel(requiredRole: UserRole): boolean {
  const currentRole = getCurrentUserRole();
  if (!currentRole) return false;
  
  const currentLevel = ROLE_HIERARCHY[currentRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  
  return currentLevel >= requiredLevel;
}

/**
 * Feature visibility based on role
 */
export const FeatureAccess = {
  // Admin features
  manageUsers: () => isAdmin(),
  manageFundis: () => isAdmin(),
  viewAllBookings: () => isAdmin(),
  assignBookings: () => isAdmin(),
  viewReports: () => isAdmin(),
  managePayments: () => hasRoleLevel('admin'),
  
  // Technician features
  acceptJobs: () => isTechnician(),
  viewAvailableJobs: () => isTechnician(),
  viewMyJobs: () => isTechnician(),
  viewEarnings: () => isTechnician(),
  
  // Customer features
  bookService: () => isCustomer(),
  viewMyBookings: () => isCustomer(),
  searchTechs: () => isCustomer(),
  
  // Multi-role features
  viewProfile: () => isUserLoggedIn(),
  viewNotifications: () => isUserLoggedIn(),
  updateSettings: () => isUserLoggedIn(),
  logout: () => isUserLoggedIn(),
};

/**
 * Get display name for role
 */
export function getRoleDisplayName(role: UserRole | null): string {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'technician':
      return 'Service Provider';
    case 'customer':
      return 'Customer';
    default:
      return 'Guest';
  }
}

/**
 * Clear user session
 */
export function clearUserSession(): void {
  try {
    localStorage.removeItem('fundiTokens');
    localStorage.removeItem('fundiUser');
  } catch (error) {
    console.error('Failed to clear user session:', error);
  }
}
