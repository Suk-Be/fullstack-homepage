import MenuNav from '@/components/header';
import { HPProps } from '@/data/HomePage';
import { mockLogInState } from '@/tests/mocks/redux';
import { navigateTo, PathAndReduxState, renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/useScroll', () => ({ default: vi.fn() }));
vi.mock('@/components/RouterLink', () => ({
    default: (props: ComponentProps<'a'>) => <a {...props} />,
}));

describe('BasicMenu', () => {
    beforeEach(() => {
        localStorage.setItem('cookiesAccepted', 'true');
        vi.clearAllMocks();
    });

    const HPLoginState = (): PathAndReduxState => ({
        route: '/',
        preloadedState: mockLogInState,
    });

    const renderUtils = ({ route, preloadedState }: PathAndReduxState) => {
        navigateTo({ route, preloadedState });
        const user = userEvent.setup();

        const logoLink = screen.queryByTestId('link-home-page');
        const impressumLink = screen.getByTestId('link-impressum-page');
        const avatarLink = screen.queryByTestId('button-open-menu');

        return { logoLink, impressumLink, avatarLink, user };
    };

    it('should call Home Page route when the logo is clicked (logged in)', async () => {
        const { logoLink, user } = renderUtils(HPLoginState());
        await user.click(logoLink!);

        const heading = screen.getByText(HPProps.data[0].attributes.title);
        expect(heading).toBeInTheDocument();
    });

    it('should render a header with Logo and an Avatar if user is logged in', () => {
        const { logoLink, avatarLink } = renderUtils(HPLoginState());

        expect(logoLink).toBeInTheDocument();
        expect(avatarLink).toBeInTheDocument();
    });

    it('should open hidden MainMenu when avatar is clicked (logged in)', async () => {
        const { avatarLink, user } = renderUtils(HPLoginState());
        expect(avatarLink).toBeInTheDocument();

        // Vorher sind die Menü-Links nicht sichtbar
        expect(screen.queryByRole('link', { name: 'Template Engine' })).not.toBeInTheDocument();

        await user.click(avatarLink!);

        // Nach Klick sind alle Menü-Links sichtbar
        expect(screen.getByRole('link', { name: 'Template Engine' })).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Template Engine Layout Examples' }),
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /playgroundpage/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /logout/i })).toBeInTheDocument();
    });

    it('should hide menu when a link inside the menu is clicked (logged in)', async () => {
        const { avatarLink, user } = renderUtils(HPLoginState());
        await user.click(avatarLink!);

        const playgroundPageLink = screen.getByRole('link', { name: /playgroundpage/i });
        expect(playgroundPageLink).toBeInTheDocument();

        await user.click(playgroundPageLink);
        expect(screen.queryByRole('link', { name: /playgroundpage/i })).not.toBeInTheDocument();
    });

    it('should render a header with a Logo and no Avatar if user is not logged in', () => {
        const { logoLink, avatarLink } = renderUtils({
            route: '/',
            preloadedState: {
                login: { isLoggedIn: false, isLoading: false, error: null },
            },
        });

        expect(logoLink).toBeInTheDocument();
        expect(avatarLink).not.toBeInTheDocument();
    });
});

describe('Toggle Basic Menu', () => {
    it('renders the logged-in main menu if logged in', () => {
        renderWithProviders(<MenuNav />, {
            route: '/',
            preloadedState: mockLogInState,
        });

        expect(screen.getByTestId('button-open-menu')).toBeInTheDocument();
    });

    it('renders the logged-out main menu if logged out', () => {
        renderWithProviders(<MenuNav />, {
            route: '/',
            preloadedState: {
                login: { isLoggedIn: false, isLoading: false, error: null },
            },
        });

        const openButton = screen.queryByTestId('button-open-menu');
        const logoLink = screen.getByRole('link', { name: /suk-be jang \(web developer\)/i });

        expect(logoLink).toBeInTheDocument();
        expect(logoLink).toHaveRole('link');
        expect(openButton).not.toBeInTheDocument();
    });
});
