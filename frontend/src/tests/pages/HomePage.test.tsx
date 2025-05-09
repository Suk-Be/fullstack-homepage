import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { navigateTo } from '../utils';

describe('HomePage', () => {
    it('should render the Logo', async () => {
        navigateTo('/');

        const heading = screen.getAllByRole('heading', {
            name: /Suk-Be Jang/i,
        });
        const claim = screen.getAllByText(/web developer/i);

        expect(claim[1]).toBeInTheDocument();
        expect(heading[1]).toBeInTheDocument();
    });
    it('should render Home Page Link', async () => {
        navigateTo('/');

        const linkHomePage = screen.getAllByRole('link');

        const user = userEvent.setup();
        await user.click(linkHomePage[0]);

        const heading = screen.getAllByRole('heading', {
            name: /Suk-Be Jang/i,
        });
        const claim = screen.getAllByText(/web developer/i);

        expect(claim[1]).toBeInTheDocument();
        expect(heading[1]).toBeInTheDocument();
    });
    it('should render Main Menu Links', async () => {
        navigateTo('/');

        const menuButton = screen.getAllByRole('button');

        const user = userEvent.setup();
        await user.click(menuButton[0]);
        // screen.debug(menuItemHomePage[0]);
        const menuItemPlaygroundPage = screen.getByRole('link', {
            name: /PlaygroundPage/i,
        });

        expect(menuItemPlaygroundPage).toBeInTheDocument();
    });
});
