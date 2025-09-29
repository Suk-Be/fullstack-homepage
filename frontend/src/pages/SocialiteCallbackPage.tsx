import Loading from '@/components/auth/shared-components/Loading';
import { BaseClient } from '@/plugins/axios';
import type { AppDispatch } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { logout } from '@/store/loginSlice';
import { selectLoginState } from '@/store/selectors/loginSelectors';
import { resetUserGrids } from '@/store/userSaveGridsSlice';
import { getAxiosStatus, logRecoverableError } from '@/utils/logger';
import { dispatchForceLogin } from '@/utils/redux/dispatchHelper';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SocialiteCallbackPage = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { userId } = useAppSelector(selectLoginState);

    useEffect(() => {
        const handleSocialiteCallback = async () => {
            try {
                await BaseClient.get('/csrf-cookie');
                const res = await BaseClient.get('/me');
                dispatchForceLogin(dispatch, res.data.id, res.data.role);
                navigate('/');
            } catch (error) {
                const axiosStatus = getAxiosStatus(error);
                logRecoverableError({
                    context: '[Auth] Failed to authenticate via socialite callback',
                    error,
                    extra: { axiosStatus },
                });
                if (userId) {
                    dispatch(resetUserGrids(userId));
                }
                dispatch(logout());
                navigate('/');
            }
        };

        handleSocialiteCallback();
    }, [dispatch, navigate, userId]);

    return <Loading message="im Anmelde Prozess ..." />;
};

export default SocialiteCallbackPage;
