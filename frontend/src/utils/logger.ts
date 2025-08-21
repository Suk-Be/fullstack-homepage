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
    } else if (import.meta.env.MODE !== 'test' || process.env.NODE_ENV !== 'test') {
        console.warn(`[DEV LOG] ${context}`, error, extra);
    }
};

export const logReduxState = (
  slice: 'login' | 'userGrid',
  state: any,
  mode: string = import.meta.env.MODE 
) => {
  if (mode === 'test' || mode === 'production') return;

  if (slice === 'login') {
    console.log('🔹 login slice updated:', state);
  } else if (slice === 'userGrid') {
    console.log('🔹 userGrid slice updated:', state);
  }
};
