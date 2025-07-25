import LoggedOutMenu from '@/components/header/LoggedOutMenu';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe } from 'vitest';

describe('LoggedOutMenu', () => {
    const renderUtils = () => {
        renderWithProviders(<LoggedOutMenu />, {
            route: '/',
            preloadedState: { login: { isLoggedIn: true } },
        });

        const user = userEvent.setup();
        const openButton = screen.queryByTestId('button-open-menu');
        const logoLink = screen.getByRole('link', { name: /suk-be jang \(web developer\)/i });

        return {
            user,
            openButton,
            logoLink,
        };
    };

    it('should render a Linked Logo', async () => {
        const { openButton, logoLink } = renderUtils();

        expect(logoLink).toBeInTheDocument();
        expect(logoLink).toHaveRole('link');
        expect(openButton).not.toBeInTheDocument();
    });
});
