import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HPProps } from '../../../data/HomePage';
import { loginAndScrollHelper } from '../../utils/testAssertUtils';
import { navigateTo, PathAndReduxState } from '../../utils/testRenderUtils';

describe('BasicMenu', () => {
    beforeEach(() => {
        localStorage.setItem('cookiesAccepted', 'true');
        vi.clearAllMocks();
    });

    const HPLoginState = (isLoggedIn: boolean): PathAndReduxState => {
        return {
            route: '/',
            preloadedState: { login: { isLoggedIn } },
        };
    };

    const renderUtils = ({ route, preloadedState }: PathAndReduxState) => {
        navigateTo({ route, preloadedState });
        const user = userEvent.setup();

        const logoLink = screen.queryByTestId('link-home-page');
        const impressumLink = screen.getByTestId('link-impressum-page');
        const avatarLink = screen.queryByTestId('button-open-menu');

        return {
            logoLink,
            impressumLink,
            avatarLink,
            user,
        };
    };
    it('should render a header with no Logo and an no Avatar if user is (not logged in)', () => {
        renderUtils(HPLoginState(false));
        const menu = screen.queryByTestId('header-main-menu');
        expect(menu).not.toBeInTheDocument();
    });

    it('should render a header with Logo and an Avatar if user is (logged in)', () => {
        const { logoLink, avatarLink } = renderUtils(HPLoginState(true));

        expect(logoLink).toBeInTheDocument();
        expect(avatarLink).toBeInTheDocument();
    });

    it('should call Home Page route when the logo is clicked (logged in)', async () => {
        const { logoLink, user } = renderUtils(HPLoginState(true));
        await user.click(logoLink!);

        const heading = screen.getByText(HPProps.data[0].attributes.title);
        expect(heading).toBeInTheDocument();
    });
    it('should have a hidden MainMenu that opens when avatar is clicked (logged in)', async () => {
        const { avatarLink, user } = renderUtils(HPLoginState(true));

        const playgroundPageLinkQuery = screen.queryByRole('link', {
            name: /playgroundpage/i,
        });
        const logoutLinkQuery = screen.queryByRole('link', {
            name: /logout/i,
        });

        expect(playgroundPageLinkQuery).not.toBeInTheDocument();
        expect(logoutLinkQuery).not.toBeInTheDocument();
        expect(avatarLink).toBeInTheDocument();

        await user.click(avatarLink!);

        const playgroundPageLink = screen.getByRole('link', {
            name: /playgroundpage/i,
        });
        const logoutLink = screen.getByRole('link', {
            name: /logout/i,
        });
        expect(playgroundPageLink).toBeInTheDocument();
        expect(logoutLink).toBeInTheDocument();
    });
    it('should hide menu when a link inside the menu is clicked (logged in)', async () => {
        const { user, avatarLink } = renderUtils(HPLoginState(true));
        await user.click(avatarLink!);
        const playgroundPageLink = screen.getByRole('link', {
            name: /playgroundpage/i,
        });
        expect(playgroundPageLink).toBeInTheDocument();

        await user.click(playgroundPageLink);
        const missingPlaygroundPageLink = screen.queryByRole('link', {
            name: /playgroundpage/i,
        });
        expect(missingPlaygroundPageLink).not.toBeInTheDocument();
    });
});

describe('Toggle Basic Menu', () => {
    it('renders the main menu if logged in and scrolled up', async () => {
        loginAndScrollHelper({
            route: '/',
            reduxState: {
                login: { isLoggedIn: true },
            },
        });

        await waitFor(() => {
            const mainMenu = screen.getByTestId('header-main-menu');
            expect(mainMenu).toBeInTheDocument();
        });
    });

    it('does not render the main menu if logged in and scrolled up', async () => {
        loginAndScrollHelper({
            route: '/',
            reduxState: {
                login: { isLoggedIn: false },
            },
        });

        await waitFor(() => {
            const mainMenu = screen.queryByTestId('header-main-menu');
            expect(mainMenu).not.toBeInTheDocument();
        });
    });
});
