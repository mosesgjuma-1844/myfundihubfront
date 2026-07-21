const rawApiBase = import.meta.env.VITE_API_BASE_URL || 'https://myfundihubback-production.up.railway.app';
export const APIDomain = rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase}/api`;
