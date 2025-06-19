import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { HPProps } from '../../../data/HomePage';
import { navigateTo } from '../../utils/testRenderUtils';

describe('BasicMenu', () => {
    beforeEach(() => {
        localStorage.setItem('cookiesAccepted', 'true');
    });
    const renderUtils = () => {
        const user = userEvent.setup();

        navigateTo('/'); // Render HomePage

        const logoLink = screen.getByTestId('link-home-page');
        const impressumLink = screen.getByTestId('link-impressum-page');
        const avatarLink = screen.getByTestId('button-main-menu');

        return {
            logoLink,
            impressumLink,
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

        const heading = screen.getByText(HPProps.data[0].attributes.title);
        expect(heading).toBeInTheDocument();
    });
    it('should have a hidden MainMenu that opens when avatar is clicked', async () => {
        const { avatarLink, user } = renderUtils();

        const playgroundPageLinkQuery = screen.queryByRole('link', {
            name: /playgroundpage/i,
        });
        const logoutLinkQuery = screen.queryByRole('link', {
            name: /logout/i,
        });

        expect(playgroundPageLinkQuery).not.toBeInTheDocument();
        expect(logoutLinkQuery).not.toBeInTheDocument();
        expect(avatarLink).toBeInTheDocument();

        await user.click(avatarLink);

        const playgroundPageLink = screen.getByRole('link', {
            name: /playgroundpage/i,
        });
        const logoutLink = screen.getByRole('link', {
            name: /logout/i,
        });
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
