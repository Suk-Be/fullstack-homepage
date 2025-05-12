import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { navigateTo } from '../utils';

describe('LayoutPage', () => {
    const renderUtil = (path: string) => {
        navigateTo(path);

        const links = screen.getAllByRole('link');
        const logoLink = links[0];

        const claim = screen.getAllByText(/web developer/i);
        const logoClaim = claim[1];

        const linkHomePage = screen.getAllByRole('link');
        const linkHP = linkHomePage[0];

        const buttons = screen.getAllByRole('button');
        const mainMenu = buttons[0];

        const user = userEvent.setup();

        return {
            logoLink,
            logoClaim,

            linkHP,
            user,
            buttons,
            mainMenu,
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
    ])('should render a header with Logo Link and Main Menu on $page', ({ link }) => {
        const { mainMenu } = renderUtil(link);
        const claim = screen.getByText(/web developer/i);
        const logoClaim = claim;

        const links = screen.getAllByRole('link');
        const logoLink = links[0];

        expect(logoClaim).toBeInTheDocument();
        expect(logoLink).toBeInTheDocument();
        expect(mainMenu).toBeInTheDocument();
    });

    it("should render a header with Logo Link and Main Menu on 'HomePage'", () => {
        const { logoLink, logoClaim, mainMenu } = renderUtil('/');

        expect(logoClaim).toBeInTheDocument();
        expect(logoLink).toBeInTheDocument();
        expect(mainMenu).toBeInTheDocument();
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
    ])('should render a Submenu with links on $page', async ({ link }) => {
        const { user, mainMenu } = renderUtil(link);

        expect(mainMenu).toBeInTheDocument();

        await user.click(mainMenu);

        const menuItemPlaygroundPage = screen.getByRole('link', {
            name: /PlaygroundPage/i,
        });

        expect(menuItemPlaygroundPage).toBeInTheDocument();
    });
});
