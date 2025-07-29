import Loading from '@/components/auth/shared-components/Loading';
import LaravelApiClient from '@/plugins/axios';
import type { AppDispatch } from '@/store';
import { login, logout, setUserId } from '@/store/loginSlice';
import { resetUserGrid } from '@/store/userGridSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
        LaravelApiClient.get('/csrf-cookie')
            .then(() => {
                return LaravelApiClient.get('/me');
            })
            .then((res) => {
                dispatch(setUserId(res.data.id));
                dispatch(login());
                navigate('/');
            })
            .catch((err) => {
                console.log('/me failed:', err);
                dispatch(resetUserGrid());
                dispatch(logout());
                navigate('/');
            });
    }, []);

    return (
        <>
            <Loading message="im Anmelde Prozess ..." />
        </>
    );
};

export default SocialiteCallbackPage;
