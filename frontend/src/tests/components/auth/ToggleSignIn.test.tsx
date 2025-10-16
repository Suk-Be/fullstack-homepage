import ToggleSignIn from '@/components/auth/Toggles';

import loginReducer from '@/store/loginSlice';
import userGridReducer from '@/store/userSaveGridsSlice';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { vi } from 'vitest';

vi.mock('@/utils/recaptcha/recaptchaToken', () => ({
    default: vi.fn(async () => 'mocked-recaptcha-token'),
}));
vi.mock('@/store/thunks/loginThunk', () => ({
    loginThunk: Object.assign(
        vi.fn(async () => ({
            type: 'login/loginThunk/fulfilled',
            payload: {
                success: true,
                userId: 1,
                role: 'user',
                message: 'Login erfolgreich!',
            },
        })),
        {
            pending: { type: 'login/loginThunk/pending' },
            fulfilled: { type: 'login/loginThunk/fulfilled' },
            rejected: { type: 'login/loginThunk/rejected' },
        },
    ),
}));

describe('ToggleSignIn', () => {
    const renderUtils = () => {
        const user = userEvent.setup();

        const store = configureStore({
            reducer: {
                login: loginReducer,
                userGrid: userGridReducer,
            },
        });

        render(
            <Provider store={store}>
                <ToggleSignIn />
            </Provider>,
        );

        return { user };
    };

    it('renders SignIn by default', () => {
        renderUtils();
        expect(screen.getByRole('heading', { name: 'Anmelden' })).toBeInTheDocument();
    });

    it('toggles to SignUp when SignIn button is clicked', async () => {
        const { user } = renderUtils();
        await user.click(screen.getByTestId('button-switch-to-sign-up'));
        expect(screen.getByRole('heading', { name: 'Registrieren' })).toBeInTheDocument();
    });

    it('toggles back to SignIn when SignUp button is clicked', async () => {
        const { user } = renderUtils();

        // To SignUp
        await user.click(screen.getByTestId('button-switch-to-sign-up'));
        expect(screen.getByRole('heading', { name: 'Registrieren' })).toBeInTheDocument();

        // Back to SignIn
        await user.click(screen.getByTestId('button-switch-to-sign-in'));
        expect(screen.getByRole('heading', { name: 'Anmelden' })).toBeInTheDocument();
    });
});
