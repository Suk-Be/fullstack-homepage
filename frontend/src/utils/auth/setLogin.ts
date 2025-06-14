import LaravelApiClient from '../../plugins/axios';
import translateHttpError from './translateHttpError';

const setLogin = async ({
    shouldFetchUser,
    email,
    password,
}: {
    shouldFetchUser: boolean;
    email: string;
    password: string;
}) => {
    try {
        // Step 1 & 2: CSRF token is automatically handled by the interceptor
        await LaravelApiClient.post('/auth/spa/login', {
            email,
            password,
        });

        // Step 3: Optionally log the user in
        if (shouldFetchUser) {
            const { data: user } = await LaravelApiClient.get('/me');
            console.log('get User data, successful login', user);
            return { success: true, user };
        }

        return { success: true };
    } catch (error: any) {
        const response = error.response;

        if (response?.status === 422) {
            return {
                success: false,
                message: response.data.message || 'Validierungsfehler',
                errors: response.data.errors || {},
            };
        }

        return {
            success: false,
            message: translateHttpError(error),
            errors: {
                email: ['Diese E-Mail ist nicht registriert oder das Passwort ist falsch.'],
            },
        };
    }
};

export default setLogin;
