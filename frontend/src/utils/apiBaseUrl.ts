const apiUrl = (): string => {
    // --- Testmodus: immer lokale API ---
    if (import.meta.env.MODE === 'test' || process.env.NODE_ENV === 'test') {
        return 'http://localhost:8000/api/v1';
    }

    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

    // --- Stelle sicher, dass /v1 angehängt wird ---
    return base.endsWith('/v1') ? base : `${base}/v1`;
};

const baseUrl = (): string => {
    if (import.meta.env.MODE === 'test' || process.env.NODE_ENV === 'test') {
        return 'http://localhost:8000';
    }

    return import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:8000';
};

export { apiUrl, baseUrl };
