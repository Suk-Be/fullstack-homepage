import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { navigateTo } from '../utils';

describe('LayoutPage', () => {
    const renderUtil = (path: string) => {
        navigateTo(path);

        const logoLink = screen.getByTestId('link-home-page');
        const impressumLink = screen.getByTestId('link-impressum-page');
        const avatarLink = screen.getByTestId('button-main-menu');

        const logoInHeader = logoLink.querySelector('h5');
        const claimInHeader = logoLink.querySelector('p');

        const user = userEvent.setup();

        return {
            logoLink,
            avatarLink,
            impressumLink,
            logoInHeader,
            claimInHeader,
            user,
        };
    };

    it.each([
        {
            page: 'ImpressumPage',
            link: '/impressum',
        },
        {
            page: 'PlaygroundPage',
            link: '/playground',
        },
    ])(
        'should render a header with home page link, impressum page link and main menu button on $page',
        ({ link }) => {
            const { logoLink, avatarLink, impressumLink } = renderUtil(link);

            expect(logoLink).toBeInTheDocument();
            expect(avatarLink).toBeInTheDocument();
            expect(impressumLink).toBeInTheDocument();
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
        const { logoInHeader, claimInHeader } = renderUtil(link);
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
            const { user, avatarLink } = renderUtil(link);
            expect(avatarLink).toBeInTheDocument();
            await user.click(avatarLink);
            const menuItemPlaygroundPage = screen.getByRole('link', {
                name: /PlaygroundPage/i,
            });
            expect(menuItemPlaygroundPage).toBeInTheDocument();
        },
    );
});
