import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Layout from '../../pages/Layout';
import { navigateTo } from '../utils/testRenderUtils';

describe('LayoutPage', () => {
    beforeEach(() => {
        localStorage.clear(); // reset before each test
        document.body.innerHTML = ''; // ensure clean DOM
        vi.clearAllMocks();
    });

    afterEach(() => {
        localStorage.clear(); // cleanup
    });

    const renderUtil = (route: string) => {
        navigateTo({route: route});

        const header = screen.queryByTestId('header');
        const main = screen.queryByTestId('main');
        const footer = screen.queryByTestId('footer');

        const toaster = screen.queryByTestId('toaster');
        const routerOutlet = screen.queryByTestId('router-outlet');

        const logoLink = screen.queryByTestId('link-home-page');
        const impressumLink = screen.getByTestId('link-impressum-page');
        const datenschutzLink = screen.getByTestId('link-datenschutz-page');
        const avatarLink = screen.queryByTestId('button-open-menu');

        const user = userEvent.setup();

        return {
            header,
            main,
            footer,
            toaster,
            routerOutlet,
            logoLink,
            avatarLink,
            impressumLink,
            datenschutzLink,
            user,
        };
    };

    it('should render a main and a footer', () => {
            const { main, footer } = renderUtil('/');

            expect(main).toBeInTheDocument();
            expect(footer).toBeInTheDocument();
        },
    );

    // Do not remove Toaster or Outlet component
    it('includes MenuNav and Toaster in the JSX', () => {
      const tree = renderer.create(<Layout />).toJSON();
      expect(tree).toMatchSnapshot();
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
