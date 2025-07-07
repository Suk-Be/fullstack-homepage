import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { HPProps } from '../../data/HomePage';
import { navigateTo } from '../utils/testRenderUtils';

describe('HomePage', () => {
    const renderUtil = (route: string, preloadedState = {}) => {
        const user = userEvent.setup();
        navigateTo({
            route,
            preloadedState,
        });

        const header = screen.queryByTestId('header-main-menu');
        const footer = screen.getByTestId('footer');

        const profile = HPProps.data.filter((item) => item.type === 'profile')[0];
        const offer = HPProps.data.filter((item) => item.type === 'offer');
        const teaser = HPProps.data.filter((item) => item.type === 'teaser')[0];

        return {
            footer,
            header,
            profile,
            offer,
            teaser,
            user,
        };
    };

    it('should render no header (if not logged in) and footer', async () => {
        const { header, footer } = renderUtil('/');
        expect(header).not.toBeInTheDocument();
        expect(footer).toBeInTheDocument();
    });

    it('should render a header (if logged in) and footer', async () => {
        const mockReduxState = {
            login: {
                isLoggedIn: true,
            },
        };
        const { header, footer } = renderUtil('/', mockReduxState);
        expect(header).toBeInTheDocument();
        expect(footer).toBeInTheDocument();
    });

    it('should render a profile section', async () => {
        const { profile } = renderUtil('/');

        const profilePic = screen.getByAltText(/suk-be jang/i);
        const subtitle = screen.getByRole('heading', { name: profile.attributes.title });
        const profileText = screen.getByText(/Als Frontend Entwickler sehe ich mich/i);

        expect(profilePic).toBeInTheDocument();
        expect(subtitle).toBeInTheDocument();
        expect(profileText).toBeInTheDocument();
    });

    it('should render a teaser section', async () => {
        const { teaser } = renderUtil('/');

        const title = screen.getByRole('heading', { name: teaser.attributes.title });
        const subtitle = screen.getByText('Konzeption und Weiterentwicklung');
        const teaserList = teaser.attributes.list;
        const teaserAmount = teaserList?.length;

        expect(title).toBeInTheDocument();
        expect(subtitle).toBeInTheDocument();
        expect(teaserAmount).toBe(4);

        teaserList?.forEach((listItem) => {
            expect(screen.getByText(listItem.number)).toBeInTheDocument();
            expect(screen.getByText(listItem.text)).toBeInTheDocument();
        });
    });

    it('should render an offer frontend entwicklung section', async () => {
        const { offer } = renderUtil('/');

        const headline1 = screen.getByTestId('offer-headline-01');
        const paragraph1 = screen.getByTestId('offer-content-01');
        const headline2 = screen.getByTestId('offer-headline-02');
        const paragraph2 = screen.getByTestId('offer-content-02');

        expect(headline1).toHaveTextContent(offer[0].attributes.title);
        expect(paragraph1).toHaveTextContent(
            'Moderne JavaScript basierte Single Page Applications, klassische Server Side Rendered Applications, Hybride Page Applications haben allesamt ihre Daseinsberechtigung.',
        );

        expect(headline2).toHaveTextContent(offer[1].attributes.title);
        expect(paragraph2).toHaveTextContent(
            'Als Web Design Ansatz verfolge ich die „form follows function“ Prinzipien der Architektur und industrieller Produkte.',
        );
    });
});
