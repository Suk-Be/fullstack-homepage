import { forceLogin } from '@/store/loginSlice';
import { dispatchForceLogin } from '@/utils/redux/dispatchHelper';
import { describe, expect, it, vi } from 'vitest';

/** 
 FYI: Ein forceLogin (übersetzt in etwa: „erzwungener Login“ oder „Sofort-Anmeldung“) ist eine Hilfsfunktion 
 bzw. ein Redux-Action-Creator, der dafür da ist, den Benutzerstatus in deiner App sofort als „eingeloggt“ zu setzen, 
 ohne dass dafür noch einmal die Login-API (/login) aufgerufen werden muss.
*/

describe('dispatchForceLogin', () => {
    it('dispatches forceLogin action with correct payload including default userName fallback', () => {
        const mockDispatch = vi.fn();

        const userData = {
            userId: 42,
            userName: 'Test User',
            role: 'user' as const,
        };

        dispatchForceLogin(mockDispatch, userData);

        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(
            forceLogin({
                userId: 42,
                userName: 'Test User',
                role: 'user',
            }),
        );
    });

    it('uses fallback "User" for userName if it is missing', () => {
        const mockDispatch = vi.fn();

        const userData = {
            userId: 99,
            role: 'admin' as const,
        };

        // Act
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatchForceLogin(mockDispatch, userData as any);

        // Assert
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(
            forceLogin({
                userId: 99,
                userName: 'User', // 🔹 Prüft den Fallback
                role: 'admin',
            }),
        );
    });
});
