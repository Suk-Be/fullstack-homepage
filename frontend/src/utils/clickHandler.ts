import { baseUrl } from './apiBaseUrl';

const webServer = baseUrl()

export const handleSignInUp = (provider: string) => {
    window.location.href = `${webServer}/api/auth/${provider}`;
};
