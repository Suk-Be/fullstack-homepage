import LaravelApiClient from '../plugins/axios';

// const isTestEnv = import.meta.env.MODE === 'test';

const registerUser = async ({
    logState,
    name,
    email,
    password,
    password_confirmation,
}: {
    logState: boolean;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}) => {
    try {
        await LaravelApiClient.post('/auth/spa/register', {
            name,
            email,
            password,
            password_confirmation,
        }).then((res) => {
            console.log('registered User hook, todo make user global available', res.data);
        });

        if (logState) {
            // after await post, now get user data
            const { data } = await LaravelApiClient.get('/user');
            console.log('get User data, successful login', data);
        }
        return { success: true };
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.errors) {
            return {
                success: false,
                errors: error.response.data.errors, // Laravel style
            };
        }

        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);

        return { success: false, message: error };
    }
};

export default registerUser;
