import requestMe from '@/components/auth/api/requestMe';
import { AppDispatch } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { logout, startAuth } from '@/store/loginSlice';
import { selectLoginState } from '@/store/selectors/loginSelectors';
import { resetUserGrids } from '@/store/userSaveGridsSlice';
import initializeCookies from '@/utils/auth/initializeCookies';
import { getAxiosStatus, logRecoverableError, logRequestState } from '@/utils/logger';
import { dispatchForceLogin } from '@/utils/redux/dispatchHelper';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useAuthInit = () => {
    const dispatch: AppDispatch = useDispatch();
    const { isLoggedIn, userId } = useAppSelector(selectLoginState);

    useEffect(() => {
        // 🔹 Guard: nur starten, wenn kein Login aktiv ist
        if (isLoggedIn && userId) {
            logRequestState('selectLoginState', userId);
            return;
        }

        const initAuth = async () => {
            dispatch(startAuth());

            const performLogout = () => {
                if (userId) {
                    dispatch(resetUserGrids(userId));
                }
                dispatch(logout());
            };

            try {
                await initializeCookies();
                logRequestState('initializeCookies');

                try {
                    const result = await requestMe();
                    logRequestState('requestMe', result);

                    if (result?.success && result.userId !== undefined) {
                        dispatchForceLogin(dispatch, result.userId, result.role!);
                    } else {
                        performLogout();
                    }
                } catch (error) {
                    logRequestState('requestMeError', error);
                    logRecoverableError({ context: '[Auth] No active session found:', error });
                    performLogout();
                }
            } catch (error) {
                const axiosStatus = getAxiosStatus(error);
                logRecoverableError({
                    context: '[Auth] Failed to initialize cookies:',
                    error,
                    extra: { axiosStatus },
                });
                logRequestState('initializeCookiesError', { error, axiosStatus });
                performLogout();
            }
        };

        initAuth();
    }, [dispatch, isLoggedIn, userId]);
};
