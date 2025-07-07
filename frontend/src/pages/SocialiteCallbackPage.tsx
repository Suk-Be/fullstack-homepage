import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LaravelApiClient from '../plugins/axios';
import type { AppDispatch } from '../store';
import { login } from '../store/loginSlice';

/**
 * Shows the loading state when Authproviders are authenticating.
 * The Authproviders use a callback route
 * @returns successful
 * user gets global state login and gets redirected to homepage
 * @returns resposne error
 * user gets error notification and gets redirected to homepage
 */

const SocialiteCallbackPage = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        LaravelApiClient.get('/me')
            .then((res) => {
                console.log('Logged in user:', res.data);
                dispatch(login());
                navigate('/');
            })
            .catch((err) => {
                console.log('Not logged in:', err);
                navigate('/');
            });
    }, []);

    return <p>Logging in...</p>;
};

export default SocialiteCallbackPage;
