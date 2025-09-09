const apiUrl = (): string => {
    if (import.meta.env.MODE === 'test' || process.env.NODE_ENV === 'test') {
        return 'http://localhost:8000/api';
    }

    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
};

const baseUrl = (): string => {
    if (import.meta.env.MODE === 'test' || process.env.NODE_ENV === 'test') {
        return 'http://localhost:8000';
    }

    return import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:8000';
};

export { apiUrl, baseUrl };
