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


export const logRequestState = (
  requestType: 'initializeCookies' | 'initializeCookiesError' | 'requestMe' | 'requestMeError' | 'selectLoginState',
  responseType?: any,
  mode: string = import.meta.env.MODE 
) => {
  if (mode === 'test' || mode === 'production') return;

  if (requestType === 'initializeCookies') {
    console.log('[useAuthInit] Cookies initialized and throttled');
  } else if (requestType === 'initializeCookiesError') {
    console.log('[useAuthInit] Cookie init failed → logout', responseType);
  } else if (requestType === 'requestMe') {
    console.log('[useAuthInit] requestMe() result:', responseType);
  } else if (requestType === 'requestMeError') {
    console.log('[useAuthInit] requestMe() failed → logging out', responseType);
  } else if (requestType === 'selectLoginState') {
    console.log('[useAuthInit] Guard active → already logged in (userId:', responseType, ')');
  }
};
