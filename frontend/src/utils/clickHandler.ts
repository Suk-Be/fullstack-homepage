import apiBaseUrl from './apiBaseUrl';

const api = apiBaseUrl()

export const handleSignInUp = (provider: string) => {
    window.location.href = `${api}/auth/${provider}`;
};
