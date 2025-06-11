import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { navigateTo } from '../utils';

describe('Datenschutz', () => {
    const renderUtils = () => {
        const user = userEvent.setup();

        navigateTo('/datenschutz'); // Render HomePage

        const linkImprintPage = screen.getByTestId('link-datenschutz-impressum-page');

        return {
            linkImprintPage,
            user,
        };
    };

    it('should render a heading', () => {
        renderUtils();
        const heading = screen.getByRole('heading', { name: /Datenschutzerklärung/i });

        expect(heading).toBeInTheDocument();
    });

    it('should render a paragraph with person responsible for data and link to imprint page', async () => {
        const { user, linkImprintPage } = renderUtils();
        const headlineDatenschutz = screen.getByText(/Verantwortlich für die Datenverarbeitung/i);
        const paragraphDatenschutz = screen.getByText(/Suk-Be Jang - Privatperson/i);
        expect(headlineDatenschutz).toBeInTheDocument();
        expect(paragraphDatenschutz).toBeInTheDocument();
        expect(linkImprintPage).toBeInTheDocument();

        await user.click(linkImprintPage);

        const paragraphImprint = screen.getByText(/Angaben gemäß § 5 DDG/i);
        expect(paragraphImprint).toBeInTheDocument();
    });

    it('should contain external links for information on google and github oauth', async () => {
        renderUtils();
        const googleOAuthLink = screen.getByText(/https:\/\/policies\.google\.com\/privacy/i);
        const githubOAuthLink = screen.getByText(
            /https:\/\/docs\.github\.com\/en\/github\/site-policy\/github-privacy-statement/i,
        );
        expect(googleOAuthLink).toBeInTheDocument();
        expect(githubOAuthLink).toBeInTheDocument();

        expect(googleOAuthLink.tagName).toBe('A');
        expect(githubOAuthLink.tagName).toBe('A');

        expect(googleOAuthLink).toHaveAttribute('href', 'https://policies.google.com/privacy');
        expect(githubOAuthLink).toHaveAttribute(
            'href',
            'https://docs.github.com/en/github/site-policy/github-privacy-statement',
        );
    });

    it('should contain external link for Landesbeauftragte Datenschutz', async () => {
        renderUtils();
        const landesbeauftragteLink = screen.getByText(/Aufsichtsbehörden in Deutschland/i);

        expect(landesbeauftragteLink).toBeInTheDocument();

        expect(landesbeauftragteLink.tagName).toBe('A');

        expect(landesbeauftragteLink).toHaveAttribute(
            'href',
            'https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html',
        );
    });
});
