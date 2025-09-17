import { RootState } from '@/store';

export const selectLoginState = (state: RootState) => state.login;

export const selectIsLoggedIn = (state: RootState): boolean =>  state.login.isLoggedIn
export const selectUserId = (state: RootState): number | undefined =>
    state.login.userId ?? undefined;

export const selectUserRole = (
  state: RootState
): 'admin' | 'user' | null | undefined => state.login.role;
