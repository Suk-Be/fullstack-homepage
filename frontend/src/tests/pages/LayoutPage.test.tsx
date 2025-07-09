import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Layout from '../../pages/Layout';
import type { RootState } from '../../store';
import { PreloadedState } from '../../types/Redux';
import { mockReduxLoggedInState, mockReduxLoggedOutState } from '../mocks/redux';
import { setupStore } from '../utils/testRenderUtils';

describe('LayoutPage', () => {
    beforeEach(() => {
        localStorage.clear(); // reset before each test
        document.body.innerHTML = ''; // ensure clean DOM
    });

    afterEach(() => {
        localStorage.clear(); // cleanup
    });

    const renderUtil = (route: string, loginState: PreloadedState<RootState>) => {
        const store = setupStore(loginState);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[route]}>
                    <Layout />
                </MemoryRouter>
            </Provider>,
        );

        const header = screen.queryByTestId('header-main-menu');
        const main = screen.queryByTestId('main');
        const footer = screen.queryByTestId('footer');

        const logoLink = screen.queryByTestId('link-home-page');
        const impressumLink = screen.getByTestId('link-impressum-page');
        const datenschutzLink = screen.getByTestId('link-datenschutz-page');
        const avatarLink = screen.queryByTestId('button-open-menu');

        const user = userEvent.setup();

        return {
            header,
            main,
            footer,
            logoLink,
            avatarLink,
            impressumLink,
            datenschutzLink,
            user,
        };
    };

    it('renders the main menu if logged in', async () => {
        const { header } = renderUtil('/', mockReduxLoggedInState);

        // MainMenu
        expect(header).toBeInTheDocument();
    });

    it('does not render the main menu if logged out', async () => {
        const store = setupStore(mockReduxLoggedOutState);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <Layout />
                </MemoryRouter>
            </Provider>,
        );

        expect(screen.queryByTestId('header-main-menu')).not.toBeInTheDocument();
    });

    it('should render a main and a footer', () => {
        const { main, footer } = renderUtil('/', mockReduxLoggedInState);

        expect(main).toBeInTheDocument();
        expect(footer).toBeInTheDocument();
    });

    it('renders and a mounted toast container', () => {
        renderUtil('/', mockReduxLoggedInState);

        expect(document.getElementById('_rht_toaster')).toBeInTheDocument();
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
        renderUtil(link, mockReduxLoggedOutState);

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
        const { user } = renderUtil(link, mockReduxLoggedOutState);

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
        renderUtil(link, mockReduxLoggedOutState);

        const banner = screen.queryByText(/diese website verwendet cookies/i);
        expect(banner).not.toBeVisible();
    });
});
