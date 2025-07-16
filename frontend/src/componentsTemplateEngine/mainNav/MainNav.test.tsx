import { render, screen, within } from '@testing-library/react';
import MainNav from '.';
import {
    AnonymousUserTemplateEngine as AnonymousUser,
    RegisteredUserTemplateEngine as RegisteredUser,
} from '../../tests/mocks/data';

describe('MainNav', () => {
    it('should render a header with logo, main navigation and authentication menu', () => {
        render(<MainNav auth={{ user: AnonymousUser }} />);

        const heading = screen.getByRole('banner');

        expect(heading).toBeInTheDocument();
    });

    it('should render a logo', () => {
        render(<MainNav auth={{ user: AnonymousUser }} />);

        const logoBanner = screen.getByRole('img', { name: 'logo' });
        const logo = within(logoBanner).getByText('Suk-Be Jang');
        const claim = within(logoBanner).getByText('Web Developer');

        expect(logoBanner).toBeInTheDocument();
        expect(logo).toBeInTheDocument();
        expect(claim).toBeInTheDocument();
    });

    it('should render main navigation', () => {
        render(<MainNav auth={{ user: AnonymousUser }} />);

        const logoBanner = screen.getByRole('link', { name: 'logo-banner' });
        const mainNav = screen.getByRole('navigation', { name: 'main' });

        expect(mainNav).toBeInTheDocument();
        expect(logoBanner).toHaveAttribute('href', '/');
        expect(within(mainNav).getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
        expect(within(mainNav).getByRole('link', { name: /layouts/i })).toHaveAttribute(
            'href',
            '/layouts',
        );
        expect(within(mainNav).getByRole('link', { name: /ecommerce/i })).toHaveAttribute(
            'href',
            '/ecommerce',
        );
        expect(within(mainNav).getByRole('link', { name: /maps/i })).toHaveAttribute(
            'href',
            '/maps',
        );
    });

    it('should render login and register button for unknown users', () => {
        render(<MainNav auth={{ user: undefined }} />);

        const authNav = screen.getByTestId('toggle-auth-menu');

        expect(authNav).toBeInTheDocument();
        expect(within(authNav).getByRole('link', { name: /log in/i })).toBeInTheDocument();
        expect(within(authNav).getByRole('link', { name: /register/i })).toBeInTheDocument();
    });

    it('should render dashboard button for known users', () => {
        render(<MainNav auth={{ user: RegisteredUser }} />);
        const authNav = screen.getByTestId('toggle-auth-menu');

        expect(authNav).toBeInTheDocument();
        expect(within(authNav).getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    });
});
