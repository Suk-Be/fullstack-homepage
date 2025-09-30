import LoggedOutMenu from '@/components/header/LoggedOutMenu';
import { mockLogInState } from '@/tests/mocks/redux';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { describe, vi } from 'vitest';

vi.mock('@/hooks/useScroll', () => ({ default: vi.fn() }));
vi.mock('@/components/RouterLink', () => ({
    default: (props: ComponentProps<'a'>) => <a {...props} />,
}));

describe('LoggedOutMenu', () => {
    const renderUtils = () => {
        renderWithProviders(<LoggedOutMenu />, {
            route: '/',
            preloadedState: mockLogInState,
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
