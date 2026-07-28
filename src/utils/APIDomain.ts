const rawApiBase = import.meta.env.VITE_API_BASE_URL || '/api';
export const APIDomain = rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase}/api`;
