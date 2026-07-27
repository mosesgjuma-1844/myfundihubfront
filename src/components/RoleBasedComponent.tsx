/**
 * RoleBasedComponent
 * 
 * Conditionally renders content based on user role
 */

import React from 'react';
import { hasRole, hasAnyRole } from '../utils/roleUtils';
import type { UserRole } from '../utils/roleUtils';

interface RoleBasedComponentProps {
  requiredRole?: UserRole | UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component to conditionally render content based on role
 * 
 * Usage:
 * <RoleBasedComponent requiredRole="admin">
 *   <AdminContent />
 * </RoleBasedComponent>
 * 
 * or multiple roles:
 * <RoleBasedComponent requiredRole={['admin', 'technician']}>
 *   <ManagementContent />
 * </RoleBasedComponent>
 */
export const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({
  requiredRole,
  fallback = null,
  children,
}) => {
  if (!requiredRole) {
    return <>{children}</>;
  }

  const allowed = Array.isArray(requiredRole)
    ? hasAnyRole(...requiredRole)
    : hasRole(requiredRole);

  return allowed ? <>{children}</> : <>{fallback}</>;
};

interface FeatureVisibilityProps {
  feature: keyof typeof FEATURE_ROLES;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Map features to required roles
 */
const FEATURE_ROLES: Record<string, UserRole[]> = {
  manageUsers: ['admin'],
  manageFundis: ['admin'],
  assignBookings: ['admin'],
  viewReports: ['admin'],
  
  acceptJobs: ['technician'],
  viewAvailableJobs: ['technician'],
  viewEarnings: ['technician'],
  
  bookService: ['customer'],
  searchTechs: ['customer'],
};

/**
 * Component to conditionally render features based on role
 * 
 * Usage:
 * <FeatureVisibility feature="manageUsers">
 *   <ManageUsersButton />
 * </FeatureVisibility>
 */
export const FeatureVisibility: React.FC<FeatureVisibilityProps> = ({
  feature,
  fallback = null,
  children,
}) => {
  const requiredRoles = FEATURE_ROLES[feature] || [];
  
  const allowed = requiredRoles.length === 0
    ? true
    : hasAnyRole(...requiredRoles);

  return allowed ? <>{children}</> : <>{fallback}</>;
};

interface AdminOnlyProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const AdminOnly: React.FC<AdminOnlyProps> = ({ fallback = null, children }) => (
  <RoleBasedComponent requiredRole="admin" fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

interface TechnicianOnlyProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const TechnicianOnly: React.FC<TechnicianOnlyProps> = ({ fallback = null, children }) => (
  <RoleBasedComponent requiredRole="technician" fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

interface CustomerOnlyProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const CustomerOnly: React.FC<CustomerOnlyProps> = ({ fallback = null, children }) => (
  <RoleBasedComponent requiredRole="customer" fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

interface AdminOrTechProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const AdminOrTech: React.FC<AdminOrTechProps> = ({ fallback = null, children }) => (
  <RoleBasedComponent requiredRole={['admin', 'technician']} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);
