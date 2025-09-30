import * as requestLogoutModule from '@/components/auth/api/requestLogout';
import LoggedInMenu from '@/components/header/LoggedInMenu';
import { HPProps } from '@/data/HomePage';
import { logout } from '@/store/loginSlice';
import { mockLoggedInUserState } from '@/tests/mocks/redux';
import type { PathAndReduxState } from '@/tests/utils/testRenderUtils';
import { navigateTo, renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { describe, vi } from 'vitest';

const mockDispatch = vi.fn();

vi.mock('@/hooks/useScroll', () => ({ default: vi.fn() }));
vi.mock('@/components/RouterLink', () => ({
    default: (props: ComponentProps<'a'>) => <a {...props} />,
}));

vi.mock('react-redux', async () => {
    const actual = await vi.importActual('react-redux');
    return {
        ...actual,
        useDispatch: vi.fn(() => mockDispatch),
    };
});

describe('LoggedInMenu', () => {
    const routeAndLoggedUserState = {
        route: '/',
        preloadedState: mockLoggedInUserState,
    };

    const renderUtilsComponent = () => {
        renderWithProviders(<LoggedInMenu />, {
            route: '/',
            preloadedState: {},
        });

        const user = userEvent.setup();
        const openButton = screen.getByTestId('button-open-menu');
        const closeButton = screen.queryByTestId('button-close-menu');

        const homepageLink = screen.getByTestId('link-home-page');
        const playgroundLink = screen.queryByRole('link', { name: /playground/i });
        const templateEngineLink = screen.queryByRole('link', { name: 'Template Engine' });
        const templateEnginePresetsLink = screen.queryByRole('link', {
            name: 'Template Engine Presets',
        });
        const logoutLink = screen.queryByRole('link', { name: /logout/i });

        return {
            user,
            openButton,
            closeButton,
            homepageLink,
            playgroundLink,
            templateEngineLink,
            templateEnginePresetsLink,
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
            templateEnginePresetsLink,
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
            const templateEngineLink = screen.queryByRole('link', { name: 'Template Engine' });
            const templateEnginePresetsLink = screen.queryByRole('link', {
                name: 'Template Engine Layout Examples',
            });
            const logoutLink = screen.getByRole('link', { name: /logout/i });

            expect(closeButton).toBeInTheDocument();
            expect(playgroundLink).toBeInTheDocument();
            expect(templateEngineLink).toBeInTheDocument();
            expect(templateEnginePresetsLink).toBeInTheDocument();
            expect(logoutLink).toBeInTheDocument();
        });

        await user.click(closeButton as HTMLButtonElement);

        await waitFor(() => {
            expect(closeButton).toBeInTheDocument();
            expect(playgroundLink).toBe(null);
            expect(templateEngineLink).toBe(null);
            expect(templateEnginePresetsLink).toBe(null);
            expect(logoutLink).toBe(null);
        });
    });

    it('should call Home Page route when the logo is clicked', async () => {
        vi.mock('../../../components/RouterLink', () => ({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            default: (props: any) => <a {...props} />,
        }));

        const { user, homepageLink } = renderUtilsPage(routeAndLoggedUserState);

        await user.click(homepageLink);

        const heading = screen.getByText(HPProps.data[0].attributes.title);
        expect(heading).toBeInTheDocument();
    });

    it('should get Playground Page route when clicked in menu', async () => {
        const { user, openButton } = renderUtilsPage(routeAndLoggedUserState);

        await user.click(openButton);

        await waitFor(() => {
            const playgroundLink = screen.getByRole('link', { name: /playground/i });
            expect(playgroundLink).toBeInTheDocument();
        });
    });

    it('should logout a logged in user and change login state to isLoggedIn to false', async () => {
        const { user, openButton } = renderUtilsPage(routeAndLoggedUserState);

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
            expect(mockDispatch).toHaveBeenCalledWith(logout());
        });
    });
});
