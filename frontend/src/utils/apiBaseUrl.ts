const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const serverBaseUrl = import.meta.env.VITE_SERVER_BASE_URL;

export default apiBaseUrl;
export { serverBaseUrl };
