const { VITE_API_URL, VITE_SOCKET_URL } = import.meta.env;

export const config = {
  API_URL: VITE_API_URL || 'http://localhost:8080',
  SOCKET_URL: VITE_SOCKET_URL || 'http://localhost:8081',
};
