import requestMe from '@/components/auth/api/requestMe';
import { AppDispatch } from '@/store';
import { forceLogin, logout, startAuth } from '@/store/loginSlice';
import { resetUserGrid } from '@/store/userGridSlice';
import initializeCookies from '@/utils/auth/initializeCookies';
import { getAxiosStatus, logRecoverableError } from '@/utils/logger';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useAuthInit = () => {
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const initAuth = async () => {
            dispatch(startAuth());
            try {
                await initializeCookies();

                try {
                    const result = await requestMe();

                    if (result?.success && result.userId !== undefined) {
                        dispatch(forceLogin(result.userId));
                    } else {
                        // response private route not successful
                        dispatch(resetUserGrid());
                        dispatch(logout());
                    }
                } catch (error) {
                    // session expired
                    logRecoverableError({ context: '[Auth] No active session found:', error });
                    dispatch(resetUserGrid());
                    dispatch(logout());
                }
            } catch (error) {
                const axiosStatus = getAxiosStatus(error);
                logRecoverableError({
                    context: '[Auth] Failed to initialize cookies:',
                    error,
                    extra: { axiosStatus },
                });
                dispatch(resetUserGrid());
                dispatch(logout());
            }
        };

        initAuth();
    }, [dispatch]);
};
