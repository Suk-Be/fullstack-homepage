import LaravelApiClient from '../plugins/axios';

const setLogout = async (logState: boolean) => {
    await LaravelApiClient.post('/auth/spa/logout');

    if (logState)
        await LaravelApiClient.get('/me')
            .then((res) => {
                console.log('User is logged in:', res.data);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    console.log('User is not logged in');
                }
            });
};

export default setLogout;
