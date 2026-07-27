/**
 * useAPIErrorHandler Hook
 * 
 * Provides centralized error handling for API responses
 * including 401, 403, 429, and other errors.
 */

import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { APIError } from '../utils/api';
import { clearUserSession, getCurrentUserDashboard } from '../utils/roleUtils';

export interface ErrorState {
  message: string | null;
  statusCode: number | null;
  isRateLimit: boolean;
  isUnauthorized: boolean;
  isUnauthenticated: boolean;
}

export interface UseAPIErrorHandlerReturn {
  error: ErrorState;
  setError: (error: ErrorState) => void;
  clearError: () => void;
  handleError: (error: unknown) => void;
  showErrorMessage: (message: string) => void;
}

const DEFAULT_ERROR_STATE: ErrorState = {
  message: null,
  statusCode: null,
  isRateLimit: false,
  isUnauthorized: false,
  isUnauthenticated: false,
};

/**
 * Hook for comprehensive API error handling
 * 
 * Usage:
 * const { error, clearError, handleError } = useAPIErrorHandler();
 * 
 * try {
 *   await apiGet('/protected/endpoint/');
 * } catch (err) {
 *   handleError(err);
 * }
 * 
 * // Now error.isUnauthorized will be true for 403
 * // error.isUnauthenticated will be true for 401
 * // error.isRateLimit will be true for 429
 */
export function useAPIErrorHandler(): UseAPIErrorHandlerReturn {
  const navigate = useNavigate();
  const [error, setError] = useState<ErrorState>(DEFAULT_ERROR_STATE);

  const clearError = useCallback(() => {
    setError(DEFAULT_ERROR_STATE);
  }, []);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof APIError) {
      const errorState: ErrorState = {
        message: err.message,
        statusCode: err.statusCode,
        isRateLimit: err.isRateLimit,
        isUnauthorized: err.isUnauthorized,
        isUnauthenticated: err.statusCode === 401,
      };

      setError(errorState);

      // Handle specific error types
      if (err.statusCode === 401) {
        // Unauthorized - clear session and redirect to login
        clearUserSession();
        navigate('/login', { replace: true });
      } else if (err.statusCode === 403) {
        // Forbidden - redirect to appropriate dashboard
        const dashboardRoute = getCurrentUserDashboard();
        navigate(dashboardRoute, { replace: true });
      } else if (err.isRateLimit) {
        // Rate limited - error state will be shown in UI
        // Component should handle retry timer
      }
    } else {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError({
        message,
        statusCode: null,
        isRateLimit: false,
        isUnauthorized: false,
        isUnauthenticated: false,
      });
    }
  }, [navigate]);

  const showErrorMessage = useCallback((message: string) => {
    setError((prev) => ({
      ...prev,
      message,
    }));
  }, []);

  return {
    error,
    setError,
    clearError,
    handleError,
    showErrorMessage,
  };
}
