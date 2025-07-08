import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mockReduxLoggedInState } from '../mocks/redux';
import { navigateTo } from '../utils/testRenderUtils';

describe('LayoutPage', () => {
    beforeEach(() => {
        localStorage.clear(); // reset before each test
        document.body.innerHTML = ''; // ensure clean DOM
    });

    afterEach(() => {
        localStorage.clear(); // cleanup
    });

    const renderUtil = (route: string, preloadedState = {}) => {
        navigateTo({
            route,
            preloadedState,
        });

        const logoLink = screen.queryByTestId('link-home-page');
        const impressumLink = screen.getByTestId('link-impressum-page');
        const datenschutzLink = screen.getByTestId('link-datenschutz-page');
        const avatarLink = screen.queryByTestId('button-open-menu');

        const user = userEvent.setup();

        return {
            logoLink,
            avatarLink,
            impressumLink,
            datenschutzLink,
            user,
        };
    };

    it.each([
        {
            page: 'ImpressumPage',
            link: '/impressum',
        },
        {
            page: 'DatenschutzPage',
            link: '/datenschutz',
        },
        {
            page: 'PlaygroundPage',
            link: '/playground',
        },
    ])(
        'should render a header with home page link, impressum page link and main menu button on $page',
        ({ link }) => {
            const { logoLink, avatarLink, impressumLink, datenschutzLink } = renderUtil(link);

            expect(logoLink).not.toBeInTheDocument();
            expect(avatarLink).not.toBeInTheDocument();
            expect(impressumLink).toBeInTheDocument();
            expect(datenschutzLink).toBeInTheDocument();
        },
    );

    it.each([
        {
            page: 'ImpressumPage',
            link: '/impressum',
        },
        {
            page: 'PlaygroundPage',
            link: '/playground',
        },
    ])('should render a header with Logo and Claim on $page', ({ link }) => {
        renderUtil(link, mockReduxLoggedInState);

        const logoLink = screen.getByTestId('link-home-page');

        const logoInHeader = logoLink.querySelector('h5');
        const claimInHeader = logoLink.querySelector('p');
        expect(logoInHeader!).toHaveTextContent(/suk-be jang/i);
        expect(claimInHeader!).toHaveTextContent(/web developer/i);
    });

    it.each([
        {
            page: 'HomePage',
            link: '/',
        },
        {
            page: 'ImprintPage',
            link: '/impressum',
        },
        {
            page: 'PlaygroundPage',
            link: '/playground',
        },
    ])(
        'should render a Submenu when clicked on main menu with links on $page',
        async ({ link }) => {
            const { user, avatarLink } = renderUtil(link, mockReduxLoggedInState);
            expect(avatarLink).toBeInTheDocument();
            await user.click(avatarLink!);
            const menuItemPlaygroundPage = screen.getByRole('link', {
                name: /PlaygroundPage/i,
            });
            expect(menuItemPlaygroundPage).toBeInTheDocument();
        },
    );

    it.each([
        {
            page: 'HomePage',
            link: '/',
        },
        {
            page: 'ImprintPage',
            link: '/impressum',
        },
        {
            page: 'DatenschutzPage',
            link: '/datenschutz',
        },
    ])('shows cookie banner on $page if cookies not', async ({ link }) => {
        renderUtil(link);

        const banner = await screen.findByText(/diese website verwendet cookies/i);
        expect(banner).toBeVisible();
    });

    it.each([
        {
            page: 'HomePage',
            link: '/',
        },
        {
            page: 'ImprintPage',
            link: '/impressum',
        },
        {
            page: 'DatenschutzPage',
            link: '/datenschutz',
        },
    ])('hides cookie banner on $page and after accepting', async ({ link }) => {
        const { user } = renderUtil(link);

        const button = await screen.findByRole('button', { name: /ok/i });
        await user.click(button);

        await waitFor(() => {
            const banner = screen.queryByText(/diese website verwendet cookies/i);
            expect(banner).not.toBeVisible();
        });

        expect(localStorage.getItem('cookiesAccepted')).toBe('true');
    });

    it.each([
        {
            page: 'HomePage',
            link: '/',
        },
        {
            page: 'ImprintPage',
            link: '/impressum',
        },
        {
            page: 'DatenschutzPage',
            link: '/datenschutz',
        },
    ])('does not show banner if cookies were already accepted', ({ link }) => {
        localStorage.setItem('cookiesAccepted', 'true');
        renderUtil(link);

        const banner = screen.queryByText(/diese website verwendet cookies/i);
        expect(banner).not.toBeVisible();
    });
});
