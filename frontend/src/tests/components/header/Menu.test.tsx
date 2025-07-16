import BasicMenu from '@/components/header/Menu';
import * as requestLogoutModule from '@/components/header/requestLogout';
import { HPProps } from '@/data/HomePage';
import type { PathAndReduxState } from '@/tests/utils/testRenderUtils';
import { navigateTo, renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, vi } from 'vitest';

describe('Menu component', () => {
    const renderUtilsComponent = () => {
        renderWithProviders(<BasicMenu />, {
            route: '/',
            preloadedState: { login: { isLoggedIn: true } },
        });

        const user = userEvent.setup();
        const openButton = screen.getByTestId('button-open-menu');
        const closeButton = screen.queryByTestId('button-close-menu');

        const homepageLink = screen.getByTestId('link-home-page');
        const playgroundLink = screen.queryByRole('link', { name: /playground/i });
        const templateEngineLink = screen.queryByRole('link', { name: /template-engine/i });
        const testAnotherProtectedPageLink = screen.queryByRole('link', {
            name: /test-another-project/i,
        });
        const logoutLink = screen.queryByRole('link', { name: /logout/i });

        return {
            user,
            openButton,
            closeButton,
            homepageLink,
            playgroundLink,
            templateEngineLink,
            testAnotherProtectedPageLink,
            logoutLink,
        };
    };

    const renderUtilsPage = ({ route, preloadedState }: PathAndReduxState) => {
        navigateTo({ route, preloadedState });

        const user = userEvent.setup();
        const homepageLink = screen.getByTestId('link-home-page');
        const openButton = screen.getByTestId('button-open-menu');

        return {
            user,
            homepageLink,
            openButton,
        };
    };

    it('should render a Menu that can be toggled', async () => {
        const {
            user,
            openButton,
            closeButton,
            homepageLink,
            playgroundLink,
            templateEngineLink,
            testAnotherProtectedPageLink,
            logoutLink,
        } = renderUtilsComponent();

        // closed Menu
        expect(homepageLink).toBeInTheDocument();
        expect(openButton).toBeInTheDocument();

        expect(closeButton).toBeInTheDocument();
        expect(playgroundLink).toBe(null);
        expect(logoutLink).toBe(null);

        await user.click(openButton);

        // opened Menu
        await waitFor(() => {
            const closeButton = screen.getByTestId('button-close-menu');
            const playgroundLink = screen.getByRole('link', { name: /playground/i });
            const templateEngineLink = screen.getByRole('link', { name: /template engine/i });

            const testAnotherProtectedPageLink = screen.getByRole('link', {
                name: /test protected page/i,
            });
            const logoutLink = screen.getByRole('link', { name: /logout/i });

            expect(closeButton).toBeInTheDocument();
            expect(playgroundLink).toBeInTheDocument();
            expect(templateEngineLink).toBeInTheDocument();
            expect(testAnotherProtectedPageLink).toBeInTheDocument();
            expect(logoutLink).toBeInTheDocument();
        });

        await user.click(closeButton as HTMLButtonElement);

        await waitFor(() => {
            expect(closeButton).toBeInTheDocument();
            expect(playgroundLink).toBe(null);
            expect(templateEngineLink).toBe(null);
            expect(testAnotherProtectedPageLink).toBe(null);
            expect(logoutLink).toBe(null);
        });
    });

    it('should call Home Page route when the logo is clicked', async () => {
        vi.mock('../../../components/RouterLink', () => ({
            default: (props: any) => <a {...props} />,
        }));

        const { user, homepageLink } = renderUtilsPage({
            route: '/',
            preloadedState: { login: { isLoggedIn: true } },
        });

        await user.click(homepageLink);

        const heading = screen.getByText(HPProps.data[0].attributes.title);
        expect(heading).toBeInTheDocument();
    });

    it('should get Playground Page route when clicked in menu', async () => {
        const { user, openButton } = renderUtilsPage({
            route: '/',
            preloadedState: { login: { isLoggedIn: true } },
        });

        await user.click(openButton);

        await waitFor(() => {
            const playgroundLink = screen.getByRole('link', { name: /playground/i });
            expect(playgroundLink).toBeInTheDocument();
        });

        // screen.debug();
    });

    it('should logout a logged in user', async () => {
        const { user, openButton } = renderUtilsPage({
            route: '/',
            preloadedState: { login: { isLoggedIn: true } },
        });

        // SpyOn
        const mockLogoutRequest = vi.spyOn(requestLogoutModule, 'default');

        await user.click(openButton);
        await waitFor(() => {
            const logoutLink = screen.getByRole('link', { name: /logout/i });
            expect(logoutLink).toBeInTheDocument();
        });
        await user.click(screen.getByRole('link', { name: /logout/i }));

        await waitFor(() => {
            expect(mockLogoutRequest).toHaveBeenCalled();
        });
    });
});
