import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../App';
import { server } from '../mocks/server'; // Import the MSW server instance

// --- Use vi.hoisted to ensure mocks are available when vi.mock factories run ---
const { mockInitializeCookies, mockRequestMe } = vi.hoisted(() => {
    return {
        mockInitializeCookies: vi.fn(),
        mockRequestMe: vi.fn(),
    };
});

// Mock every Module that App.tsx uses
vi.mock('../../plugins/initializeCookies', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../plugins/initializeCookies')>();
    return {
        ...actual,
        default: mockInitializeCookies,
    };
});

vi.mock('../../components/auth/SignUp/requestMe', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../components/auth/SignUp/requestMe')>();
    return {
        ...actual,
        default: mockRequestMe,
    };
});

vi.mock('../../providers', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('../../pages/Layout', () => ({
    default: () => <div>Layout Content</div>,
}));


describe('App initial load behavior (auto-login)', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default successful behavior for our mocks
        mockInitializeCookies.mockResolvedValue(undefined); // initializeCookies succeeds
        mockRequestMe.mockResolvedValue(true); // requestMe succeeds (user logged in)

        // Ensure MSW handlers are reset to their default successful state
        server.resetHandlers();
    });

    it('should attempt auto-login by calling initializeCookies and requestMe on mount', async () => {
        render(<App />);

        await waitFor(() => {
            expect(mockInitializeCookies).toHaveBeenCalledTimes(1);
            expect(mockRequestMe).toHaveBeenCalledTimes(1);
            expect(mockRequestMe).toHaveBeenCalledWith(true);
        });
    });

    it('should handle requestMe failure (no active session)', async () => {
        // Cookies initialized
        mockInitializeCookies.mockResolvedValue(undefined); 
        // Simulate no session
        mockRequestMe.mockRejectedValue(new Error('Unauthorized')); 

        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        render(<App />);

        await waitFor(() => {
            expect(mockInitializeCookies).toHaveBeenCalledTimes(1);
            expect(mockRequestMe).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith('[Auth] No active session found');
        });

        // Clean up the spy
        consoleSpy.mockRestore(); 
    });

    it('should not call requestMe if initializeCookies fails', async () => {
        // Simulate cookie init failure  
        mockInitializeCookies.mockRejectedValue(new Error('Cookie init failed')); 

        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        render(<App />);

        await waitFor(() => {
            expect(mockInitializeCookies).toHaveBeenCalledTimes(1);
            expect(mockRequestMe).not.toHaveBeenCalled();
            expect(consoleSpy).not.toHaveBeenCalledWith('[Auth] No active session found');
        });

        consoleSpy.mockRestore();
    });
});