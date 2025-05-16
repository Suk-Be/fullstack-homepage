// import { useQuery } from '@tanstack/react-query';
// import { User } from '../entities';
import { useEffect } from 'react';
import LaravelAxiosClient from '../plugins/axios';

// const useLogin = () => {
// 	return useQuery<User, Error>({
// 		queryFn: async (): Promise<User> => {
// 			await LaravelAxiosClient.post('/auth/spa/login', {
// 				email: 'sok@example.com',
// 				password: 'manager101',
// 			});
// 			const { data } = await LaravelAxiosClient.get('/user');
// 			console.log(data); // should output user details.
// 			return await data.json();
// 		},
// 		queryKey: ['user'],
// 		staleTime: Infinity,
// 	});
// };

const useLogin = () =>
    useEffect(() => {
        const setAuth = async () => {
            await LaravelAxiosClient.post('/auth/spa/login', {
                email: 'sok@example.com',
                password: 'manager101',
            });

            const { data } = await LaravelAxiosClient.get('/user');
            console.log('get User data, successful login', data); // should output user details.
        };

        setAuth();
    }, []);

export default useLogin;
