import { useEffect } from 'react';
import LaravelAxiosClient from '../plugins/axios';

const dummyData = {
    name: 'Jimmy Doe',
    email: 'jimmy@example.com',
    password: 'password123',
    password_confirmation: 'password123',
};

const useRegister = () =>
    useEffect(({ name, email, password, password_confirmation } = dummyData) => {
        const registerNewUser = async () => {
            await LaravelAxiosClient.post('/auth/spa/register', {
                name: name,
                email: email,
                password: password,
                password_confirmation: password_confirmation,
            });

            const { data } = await LaravelAxiosClient.get('/user');
            console.log('get User data, successful registration', data);
        };

        registerNewUser();
    }, []);

export default useRegister;
