import LaravelApiClient from '../plugins/axios';

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
    await LaravelApiClient.post('/auth/spa/register', {
        name,
        email,
        password,
        password_confirmation,
    }).then((res) => {
        console.log('User', res.data);
    });

    if (logState) {
        // after await post, now get user data
        const { data } = await LaravelApiClient.get('/user');
        console.log('get User data, successful login', data);
    }
};

export default registerUser;
