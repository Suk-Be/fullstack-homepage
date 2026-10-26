import { AuthSocialButtons } from '@/components/auth/auth-shared-components/AuthSocialButtons'; // <- adjust path
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/clickHandler', () => ({
    handleSignInUp: vi.fn(),
}));

vi.mock('@/components/icons/CustomIcons', () => ({
    GithubIcon: () => <svg data-testid="github-icon" />,
    GoogleIcon: () => <svg data-testid="google-icon" />,
}));

import { handleSignInUp } from '@/utils/clickHandler';

describe('AuthSocialButtons', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const setup = async (mode: 'signin' | 'signup') => {
        const user = userEvent.setup();
        render(<AuthSocialButtons mode={mode} />);
        return { user };
    };

    it('renders signup texts and testids when mode="signup"', async () => {
        await setup('signup');

        expect(screen.getByText('registrieren mit Github')).toBeInTheDocument();
        expect(screen.getByText('registrieren mit Google')).toBeInTheDocument();

        // assumes RegisterButtonSocialite uses data-testid={testIdIdentifier}
        expect(screen.getByTestId('form-button-register-with-github')).toBeInTheDocument();
        expect(screen.getByTestId('form-button-register-with-google')).toBeInTheDocument();
    });

    it('renders signin texts and testids when mode="signin"', async () => {
        await setup('signin');

        expect(screen.getByText('Anmelden mit Github')).toBeInTheDocument();
        expect(screen.getByText('Anmelden mit Google')).toBeInTheDocument();

        expect(screen.getByTestId('form-button-login-with-github')).toBeInTheDocument();
        expect(screen.getByTestId('form-button-login-with-google')).toBeInTheDocument();
    });

    it('calls handleSignInUp("github") when github button is clicked (signin)', async () => {
        const { user } = await setup('signin');

        await user.click(screen.getByTestId('form-button-login-with-github'));

        expect(handleSignInUp).toHaveBeenCalledTimes(1);
        expect(handleSignInUp).toHaveBeenCalledWith('github');
    });

    it('calls handleSignInUp("google") when google button is clicked (signup)', async () => {
        const { user } = await setup('signup');

        await user.click(screen.getByTestId('form-button-register-with-google'));

        expect(handleSignInUp).toHaveBeenCalledTimes(1);
        expect(handleSignInUp).toHaveBeenCalledWith('google');
    });
});
