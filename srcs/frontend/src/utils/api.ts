/**
 * API Helper Utility
 * Handles API URL construction for different environments
 * - Production: Uses VITE_API_URL from environment variables
 * - Development: Uses relative URLs (proxied through Vite/nginx)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const WS_BASE_URL = import.meta.env.VITE_WS_URL || '';

/**
 * Get the full API URL for a given path
 * @param path - API endpoint path (e.g., '/api/users/me')
 * @returns Full URL for the API endpoint
 */
export const getApiUrl = (path: string): string => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

/**
 * Get the WebSocket URL for game connections
 * @returns WebSocket URL
 */
export const getWsUrl = (): string => {
  if (WS_BASE_URL) {
    return `${WS_BASE_URL}/ws/game`;
  }

  // Fallback for local development
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${location.host}/ws/game`;
};

/**
 * Fetch wrapper with API URL handling
 * @param path - API endpoint path
 * @param options - Fetch options
 * @returns Fetch promise
 */
export const apiFetch = (path: string, options?: RequestInit): Promise<Response> => {
  return fetch(getApiUrl(path), {
    ...options,
    credentials: 'include', // Always include credentials for cookies
  });
};


