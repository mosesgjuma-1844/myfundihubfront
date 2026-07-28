const defaultApiBase = import.meta.env.PROD
  ? 'https://myfundihubback-production.up.railway.app/api'
  : '/api';

const rawApiBase = import.meta.env.VITE_API_BASE_URL || defaultApiBase;
export const APIDomain = rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase}/api`;
