import requestMe from '@/components/auth/api/requestMe';
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
          } else {
            // if cannot access private route set global state
            dispatch(logout());
          }
        } catch (error) {
          logRecoverableError({ context: '[Auth] No active session found:', error });
          dispatch(logout());
        }

      } catch (error) {
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

