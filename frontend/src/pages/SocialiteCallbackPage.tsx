import Loading from '@/components/auth/shared-components/Loading';
import LaravelApiClient from '@/plugins/axios';
import type { AppDispatch } from '@/store';
import { forceLogin, logout } from '@/store/loginSlice';
import { resetUserGrid } from '@/store/userGridSlice';
import { getAxiosStatus, logRecoverableError } from '@/utils/logger';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SocialiteCallbackPage = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const handleSocialiteCallback = async () => {
            try {
                await LaravelApiClient.get('/csrf-cookie');
                const res = await LaravelApiClient.get('/me');
                dispatch(forceLogin(res.data.id));
                navigate('/');
            } catch (error) {
                const axiosStatus = getAxiosStatus(error);
                logRecoverableError({
                    context: '[Auth] Failed to authenticate via socialite callback',
                    error,
                    extra: { axiosStatus },
                });

                dispatch(resetUserGrid());
                dispatch(logout());
                navigate('/');
            }
        };

        handleSocialiteCallback();
    }, [dispatch, navigate]);

    return <Loading message="im Anmelde Prozess ..." />;
};

export default SocialiteCallbackPage;
