import { AppDispatch } from '@/store';
import { forceLogin } from '@/store/loginSlice';

export const dispatchForceLogin = (
    dispatch: AppDispatch,
    userData: { userId: number; userName?: string; role: 'admin' | 'user' | null },
) => {
    dispatch(
        forceLogin({
            userId: userData.userId,
            userName: userData.userName ?? 'User',
            role: userData.role,
        }),
    );
};
