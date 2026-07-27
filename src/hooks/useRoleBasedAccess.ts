/**
 * useRoleBasedAccess Hook
 * 
 * Provides role-based access control and automatic redirects
 * for protecting dashboard pages.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserRole, getDashboardRouteForRole } from '../utils/roleUtils';
import type { UserRole } from '../utils/roleUtils';

export interface UseRoleBasedAccessOptions {
  requiredRole?: UserRole | UserRole[];
  fallbackRoute?: string;
  onUnauthorized?: () => void;
  onUnauthenticated?: () => void;
}

export interface UseRoleBasedAccessReturn {
  isAuthorized: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
  error: string | null;
}

/**
 * Hook to enforce role-based access control
 * 
 * Usage:
 * const { isAuthorized, isLoading } = useRoleBasedAccess({
 *   requiredRole: 'admin'
 * });
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (!isAuthorized) return <UnauthorizedPage />;
 * 
 * return <AdminPage />;
 */
export function useRoleBasedAccess(
  options: UseRoleBasedAccessOptions = {}
): UseRoleBasedAccessReturn {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userRole = getCurrentUserRole();
  const {
    requiredRole,
    fallbackRoute,
    onUnauthorized,
    onUnauthenticated,
  } = options;

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Check if user is authenticated
    if (!userRole) {
      setError('Not authenticated');
      setIsAuthorized(false);
      setIsLoading(false);

      // Call callback
      if (onUnauthenticated) {
        onUnauthenticated();
      } else {
        // Redirect to login
        navigate('/login', { replace: true });
      }
      return;
    }

    // Check if user has required role
    if (requiredRole) {
      const allowedRoles = Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole];

      const hasRequiredRole = allowedRoles.includes(userRole);

      if (!hasRequiredRole) {
        setError(`Access denied. Required role: ${allowedRoles.join(' or ')}`);
        setIsAuthorized(false);
        setIsLoading(false);

        // Call callback
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          // Redirect to user's dashboard
          const dashboardRoute = fallbackRoute || getDashboardRouteForRole(userRole);
          navigate(dashboardRoute, { replace: true });
        }
        return;
      }
    }

    // User is authorized
    setIsAuthorized(true);
    setError(null);
    setIsLoading(false);
  }, [userRole, requiredRole, navigate, onUnauthorized, onUnauthenticated]);

  return {
    isAuthorized,
    isLoading,
    userRole,
    error,
  };
}
