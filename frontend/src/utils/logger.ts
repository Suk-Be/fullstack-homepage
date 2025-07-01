import { isAxiosError } from 'axios';

/**
 * Extract the HTTP status from an Axios error.
 */
export const getAxiosStatus = (error: unknown): number | null => {
    return isAxiosError(error) && error.response?.status ? error.response.status : null;
};

/**
 * Logs recoverable errors to console in dev or to backend in production.
 */

export const logRecoverableError = ({
    context,
    error,
    extra = {},
}: {
    context: string;
    error: unknown;
    extra?: Record<string, unknown>;
}) => {
    if (import.meta.env.MODE === 'production') {
        // Send to external service or API
        fetch('/api/log-client-error', {
            method: 'POST',
            body: JSON.stringify({
                context,
                error: isAxiosError(error) ? error.toJSON() : String(error),
                extra,
                timestamp: new Date().toISOString(),
            }),
        });
    } else {
        console.warn(`[DEV LOG] ${context}`, error, extra);
    }
};
