import { render, screen } from '@testing-library/react';
import { WelcomeProps } from '../../pages/WelcomePage';
import { WelcomePageDataTemplateEngine as WelcomePageData } from '../../tests/mocks/data';
import AllTeasers from './index';

describe('AllTeasers', () => {
    const { teasers, teasersWithLinks } = WelcomePageData();

    it('should render two types of teasers: Teasers and TeasersWithLinks', () => {
        render(<AllTeasers data={WelcomeProps} />);
        expect(teasers.length).toBe(3);
        expect(teasersWithLinks.length).toBe(1);
    });

    it.each([
        {
            type: teasers[0].type,
            link: teasers[0].link,
            title: teasers[0].attributes.title,
            description: teasers[0].attributes.description,
            image: teasers[0].attributes.image,
            isBigCard: teasers[0].attributes.isBigCard,
        },
        {
            type: teasers[1].type,
            link: teasers[1].link,
            title: teasers[1].attributes.title,
            description: teasers[1].attributes.description,
            isBigCard: teasers[1].attributes.isBigCard,
        },
        {
            type: teasers[2].type,
            link: teasers[2].link,
            title: teasers[2].attributes.title,
            description: teasers[2].attributes.description,
            isBigCard: teasers[2].attributes.isBigCard,
        },
    ])(
        'should render teaser $type with title $title, link $link, teaser text and an image if provided',
        ({ title, description, image, isBigCard, link }) => {
            render(<AllTeasers data={WelcomeProps} />);

            expect(screen.getByText(title)).toBeInTheDocument();
            expect(screen.getByText(description)).toBeInTheDocument();
            expect(screen.getByRole('link', { name: title })).toHaveAttribute('href', link);

            // if isBigCard available it renders an image
            if (isBigCard) {
                const img = screen.getByAltText(title);
                expect(img).toHaveAttribute('src', image);
            }
        },
    );

    it.each([
        {
            type: teasersWithLinks[0].type,
            title: teasersWithLinks[0].attributes.title,
            description: teasersWithLinks[0].attributes.description,
        },
    ])('should render teaser $type with title $title and links with flowing text', ({ title }) => {
        render(<AllTeasers data={WelcomeProps} />);

        expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
        expect(screen.getByText(/laravel\'s robust library/i)).toBeInTheDocument();
    });
});
