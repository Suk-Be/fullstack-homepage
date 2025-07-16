import requestMe from '@/components/auth/SignUp/requestMe';
import initializeCookies from '@/plugins/initializeCookies';
import { AppDispatch } from '@/store';
import { login, logout } from '@/store/loginSlice';
import { getAxiosStatus, logRecoverableError } from '@/utils/logger';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useAuthInit = () => {
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const initAuth = async () => {
            try {
                await initializeCookies();
                try {
                    const result = await requestMe(true);
                    if (result && result.success) {
                        dispatch(login());
                    }
                } catch (error) {
                    logRecoverableError({ context: '[Auth] No active session found:', error });
                    dispatch(logout());
                }
            } catch (error) {
                // This catch block is for when initializeCookies fails
                const axiosStatus = getAxiosStatus(error);
                logRecoverableError({
                    context: '[Auth] Failed to initialize cookies:',
                    error,
                    extra: { axiosStatus },
                });
                dispatch(logout());
            }
        };

        initAuth();
    }, [dispatch]);
};
