import { AppDispatch } from '@/store';
import { forceLogin } from '@/store/loginSlice';

export const dispatchForceLogin = (dispatch: AppDispatch, id: number, role: string) => {
    dispatch(forceLogin({ userId: id, role: role as 'admin' | 'user' }));
};
