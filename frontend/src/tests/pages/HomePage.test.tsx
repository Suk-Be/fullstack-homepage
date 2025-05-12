import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { HPProps } from '../../data/HomePage';
import { navigateTo } from '../utils';

describe('HomePage', () => {
    const renderUtil = () => {
        navigateTo('/');

        const heading = screen.getAllByRole('heading', {
            name: /Suk-Be Jang/i,
        });
        const logo = heading[1];
        const claim = screen.getAllByText(/web developer/i);
        const logoClaim = claim[1];

        const linkHomePage = screen.getAllByRole('link');
        const linkHP = linkHomePage[0];

        const buttons = screen.getAllByRole('button');
        const mainMenu = buttons[0];

        const user = userEvent.setup();

        const headline = screen.getByText(HPProps.data[0].attributes.title);

        return {
            logo,
            logoClaim,
            user,
            linkHP,
            headline,
            buttons,
            mainMenu,
        };
    };
    it('should render the Logo', async () => {
        const { logo, logoClaim } = renderUtil();

        expect(logo).toBeInTheDocument();
        expect(logoClaim).toBeInTheDocument();
    });
    it('should render Home Page Link', async () => {
        const { linkHP } = renderUtil();

        expect(linkHP).toBeInTheDocument();
    });
    it('should render Main Menu and a link from it', async () => {
        const { user, mainMenu } = renderUtil();

        await user.click(mainMenu);

        const menuItemPlaygroundPage = screen.getByRole('link', {
            name: /PlaygroundPage/i,
        });

        expect(menuItemPlaygroundPage).toBeInTheDocument();
    });

    it('should render headline', async () => {
        const { headline } = renderUtil();

        expect(headline).toBeInTheDocument();
    });
});
