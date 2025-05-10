import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import MenuNav from '../../../components/header';
import { HPProps } from '../../../data/HomePage';
import { navigateTo } from '../../utils';

describe('BasicMenu', () => {
    const renderUtils = () => {
        const { container } = render(<MenuNav />);
        const logoLink = screen.getByRole('link');
        const avatarLink = screen.getByRole('button');
        const user = userEvent.setup();

        return {
            container,
            logoLink,
            avatarLink,
            user,
        };
    };
    it('should render a header with Logo and an Avatar', () => {
        const { logoLink, avatarLink } = renderUtils();

        expect(logoLink).toBeInTheDocument();
        expect(avatarLink).toBeInTheDocument();
    });
    it('should call Home Page route when the logo is clicked', async () => {
        const { logoLink, user } = renderUtils();

        await user.click(logoLink);
        navigateTo('/');
        const heading = screen.getByText(HPProps.data[0].attributes.title);

        expect(heading).toBeInTheDocument();
    });
    it('should have a hidden MainMenu that opens when avatar is clicked', async () => {
        const { logoLink, user, avatarLink } = renderUtils();

        // only Link is LogoLink
        const allLinks = await screen.findAllByRole('link');
        expect(allLinks.length).toBe(1);
        expect(logoLink).toBeInTheDocument();

        await user.click(avatarLink);

        const checkLinks = await screen.findAllByRole('link');
        const playgroundPageLink = screen.getByRole('link', {
            name: /playgroundpage/i,
        });
        const logoutLink = screen.getByRole('link', {
            name: /logout/i,
        });
        expect(checkLinks.length).toBeGreaterThan(1);
        expect(playgroundPageLink).toBeInTheDocument();
        expect(logoutLink).toBeInTheDocument();
    });
    it('should hide menu when a link inside the menu is clicked', async () => {
        const { user, avatarLink } = renderUtils();
        await user.click(avatarLink);

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
