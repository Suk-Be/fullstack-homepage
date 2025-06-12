import apiBaseUrl from './apiBaseUrl';

export const handleSignInUp = (provider: string) => {
    window.location.href = `${apiBaseUrl}/auth/${provider}`;
};
