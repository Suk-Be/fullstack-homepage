import { RootState } from '@/store';

export const selectLoginState = (state: RootState) => state.login;
export const selectIsLoggedIn = (state: RootState): boolean => state.login.isLoggedIn;
export const selectUserId = (state: RootState): number | undefined =>
    state.login.userId ?? undefined;
export const selectUserRole = (state: RootState): 'admin' | 'user' | null | undefined =>
    state.login.role;
export const selectUserInitials = (state: RootState): string => {
    const userName = state.login.userName?.trim();
    if (!userName) return 'U';

    const parts = userName.trim().split(' ');
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
};
