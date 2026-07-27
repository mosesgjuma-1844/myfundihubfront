/**
 * Token Manager - Handles JWT token storage, retrieval, and refresh
 */

export interface Tokens {
  access: string;
  refresh: string;
}

export interface StoredTokens extends Tokens {
  expiresAt: number; // Unix timestamp
}

const TOKEN_STORAGE_KEY = 'fundiTokens';
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes before actual expiry

/**
 * Decode JWT token to get payload (without verification - for expiry check only)
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
function decodeToken(token: string): { exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Get expiration time of token (in milliseconds)
 * @param token JWT token
 * @returns Milliseconds from now until token expires, or 0 if expired
 */
export function getTokenExpiryTime(token: string): number {
  const payload = decodeToken(token);
  if (!payload?.exp) return 0;

  const expiryTime = payload.exp * 1000; // Convert to milliseconds
  const now = Date.now();
  return Math.max(0, expiryTime - now);
}

/**
 * Check if token is expired
 * @param token JWT token
 * @returns true if token is expired or close to expiry
 */
export function isTokenExpired(token: string): boolean {
  const expiryTime = getTokenExpiryTime(token);
  return expiryTime < TOKEN_EXPIRY_BUFFER;
}

/**
 * Store tokens in localStorage
 * @param tokens Tokens object with access and refresh tokens
 */
export function storeTokens(tokens: Tokens): void {
  const accessPayload = decodeToken(tokens.access);
  const expiresAt = accessPayload?.exp ? accessPayload.exp * 1000 : Date.now() + 60 * 60 * 1000;

  const storedTokens: StoredTokens = {
    ...tokens,
    expiresAt,
  };

  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(storedTokens));
}

/**
 * Get stored access token
 * @returns Access token string or null if not found
 */
export function getAccessToken(): string | null {
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!stored) return null;

  try {
    const tokens: StoredTokens = JSON.parse(stored);
    return tokens.access || null;
  } catch {
    return null;
  }
}

/**
 * Get stored refresh token
 * @returns Refresh token string or null if not found
 */
export function getRefreshToken(): string | null {
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!stored) return null;

  try {
    const tokens: StoredTokens = JSON.parse(stored);
    return tokens.refresh || null;
  } catch {
    return null;
  }
}

/**
 * Get both tokens
 * @returns Tokens object or null if not found
 */
export function getStoredTokens(): StoredTokens | null {
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Clear tokens from storage
 */
export function clearTokens(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/**
 * Check if access token is valid (not expired)
 * @returns true if token exists and is not expired
 */
export function hasValidToken(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

/**
 * Check if refresh token exists and is valid
 * @returns true if refresh token exists and is not expired
 */
export function hasValidRefreshToken(): boolean {
  const token = getRefreshToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

/**
 * Get Authorization header for API requests
 * @returns Authorization header string or null if no valid token
 */
export function getAuthorizationHeader(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  return `Bearer ${token}`;
}

/**
 * Update tokens (refresh token rotation)
 * @param newTokens New tokens from server
 */
export function updateTokens(newTokens: Partial<Tokens>): void {
  const current = getStoredTokens();
  if (!current) return;

  const updated: StoredTokens = {
    ...current,
    ...newTokens,
  };

  const accessPayload = decodeToken(updated.access);
  if (accessPayload?.exp) {
    updated.expiresAt = accessPayload.exp * 1000;
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Log out user and clear tokens
 */
export function logout(): void {
  clearTokens();
  localStorage.removeItem('fundiUser');
}

export default {
  storeTokens,
  getAccessToken,
  getRefreshToken,
  getStoredTokens,
  clearTokens,
  hasValidToken,
  hasValidRefreshToken,
  getAuthorizationHeader,
  updateTokens,
  isTokenExpired,
  getTokenExpiryTime,
  logout,
};
