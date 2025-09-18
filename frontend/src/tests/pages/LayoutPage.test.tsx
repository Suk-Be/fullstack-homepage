import Layout from '@/pages/Layout';
import type { RootState } from '@/store';
import { mockLogInState, mockLogInStateFalse } from '@/tests/mocks/redux';
import { setupStore } from '@/tests/utils/testRenderUtils';
import { PreloadedState } from '@/types/Redux';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

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

    it('renders a header (MenuNav component) if logged in', async () => {
        const { header } = renderUtil('/', mockLogInState);

        expect(header).toBeInTheDocument();
    });

    it('renders a header (MenuNav component) if logged out', async () => {
        const { header } = renderUtil('/', mockLogInStateFalse);

        expect(header).toBeInTheDocument();
    });

    it('should render a main and a footer', () => {
        const { main, footer } = renderUtil('/', mockLogInState);

        expect(main).toBeInTheDocument();
        expect(footer).toBeInTheDocument();
    });

    it('renders and a mounted toast container', () => {
        renderUtil('/', mockLogInState);

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
        renderUtil(link, mockLogInStateFalse);

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
        const { user } = renderUtil(link, mockLogInStateFalse);

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
        renderUtil(link, mockLogInStateFalse);

        const banner = screen.queryByText(/diese website verwendet cookies/i);
        expect(banner).not.toBeVisible();
    });
});
