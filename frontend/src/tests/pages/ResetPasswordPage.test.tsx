import ResetPasswordPage from '@/pages/ResetPasswordPage';
import { store } from '@/store';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import { userLoggedAdmin } from '@/tests/mocks/api';

describe('ResetPassWordPage', () => {
    it('should render the ResetPasswordPage', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter
                    initialEntries={[
                        `/reset-password?token=test${userLoggedAdmin}&email=test@example.com`,
                    ]}
                >
                    <ResetPasswordPage />
                </MemoryRouter>
            </Provider>,
        );

        const heading = await screen.findByRole('heading', { name: /Passwort zurücksetzen/i });
        expect(heading).toBeInTheDocument();
    });
    // Since ResetPasswordPage essentially renders ResetPassword Component within a responsive layout container
    // A detailed test about the behavior can be found ResetPassword.test.tsx
});
