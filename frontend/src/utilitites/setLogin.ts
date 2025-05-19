import LaravelApiClient from '../plugins/axios';

const setLogin = async ({
    logState,
    email,
    password,
    password_confirmation,
}: {
    logState: boolean;
    email: string;
    password: string;
    password_confirmation: string;
}) => {
    await LaravelApiClient.post('/auth/spa/login', {
        email,
        password,
        password_confirmation,
    });

    if (logState) {
        const { data } = await LaravelApiClient.get('/user');
        console.log('get User data, successful login', data);
    }
};

export default setLogin;
