import { APIDomain } from './APIDomain';
import { getAuthorizationHeader, storeTokens } from './tokenManager';
import type { Tokens } from './tokenManager';

export type MenuItem = {
  id: string;
  label: string;
  link: string;
  icon: string;
};

export type UserProfile = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  specialization: string;
  yearsOfExperience: number;
};

export type BookingSummary = {
  id: number;
  serviceType: string;
  location: string;
  county: string;
  townOrEstate: string;
  landmark: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
  serviceWindow: string;
  status: string;
  estimatedCost: number;
  calloutFee?: number | null;
  callout_fee?: number | null;
  customer: {
    id: number;
    name: string;
  } | null;
  assignedTechnician: {
    id: number;
    name: string;
  } | null;
};

export type LoginResponse = {
  ok: boolean;
  message: string;
  role: string;
  redirect: string;
  tokens?: Tokens;
  user: UserProfile;
};

export class APIError extends Error {
  public statusCode: number;
  public message: string;
  public isRateLimit: boolean;
  public isUnauthorized: boolean;

  constructor(
    statusCode: number,
    message: string,
    isRateLimit = false,
    isUnauthorized = false
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.message = message;
    this.isRateLimit = isRateLimit;
    this.isUnauthorized = isUnauthorized;
  }
}

/**
 * Build headers for API requests with JWT token
 */
function buildHeaders(includeAuth = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const authHeader = getAuthorizationHeader();
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (authHeader && token) {
      headers['Authorization'] = authHeader;
      headers['X-Access-Token'] = token;
      headers['X-Auth-Token'] = token;
    }
  }

  return headers;
}

/**
 * Handle API error responses
 */
function handleErrorResponse(response: Response, data: any): never {
  const statusCode = response.status;
  const isRateLimit = statusCode === 429;
  const isUnauthorized = statusCode === 403;
  const message = data?.message || `API Error: ${statusCode}`;

  throw new APIError(statusCode, message, isRateLimit, isUnauthorized);
}

/**
 * Generic GET request
 */
export async function apiGet<T>(path: string, includeAuth = true): Promise<T> {
  try {
    const response = await fetch(`${APIDomain}${path}`, {
      method: 'GET',
      headers: buildHeaders(includeAuth),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      handleErrorResponse(response, data);
    }

    if (!data.ok) {
      throw new APIError(response.status, data.message || 'API request failed');
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(0, error instanceof Error ? error.message : 'Network error');
  }
}

/**
 * Generic POST request
 */
export async function apiPost<T>(path: string, payload: unknown, includeAuth = true): Promise<T> {
  try {
    const response = await fetch(`${APIDomain}${path}`, {
      method: 'POST',
      headers: buildHeaders(includeAuth),
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      handleErrorResponse(response, data);
    }

    if (!data.ok) {
      throw new APIError(response.status, data.message || 'API request failed');
    }

    // Handle token refresh if present in response
    if (data.tokens) {
      storeTokens(data.tokens);
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(0, error instanceof Error ? error.message : 'Network error');
  }
}

/**
 * Login request - special handling for token storage
 */
export async function apiLogin<T extends LoginResponse>(path: string, payload: unknown): Promise<T> {
  try {
    const response = await fetch(`${APIDomain}${path}`, {
      method: 'POST',
      headers: buildHeaders(false),
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      handleErrorResponse(response, data);
    }

    if (!data.ok) {
      throw new APIError(response.status, data.message || 'Login failed');
    }

    // Store tokens if provided
    if (data.tokens) {
      storeTokens(data.tokens);
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(0, error instanceof Error ? error.message : 'Network error');
  }
}

export const iconMapping: Record<string, string> = {
  dashboard: 'AiOutlineDashboard',
  users: 'AiOutlineUser',
  tool: 'AiOutlineTool',
  book: 'AiOutlineBook',
  wallet: 'AiOutlineWallet',
  'file-text': 'AiOutlineFileText',
  setting: 'AiOutlineSetting',
  search: 'AiOutlineSearch',
  bell: 'AiOutlineBell',
  calendar: 'AiOutlineCalendar',
  environment: 'AiOutlineEnvironment',
};
