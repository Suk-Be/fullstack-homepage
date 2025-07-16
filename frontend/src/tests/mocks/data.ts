import { WelcomeProps } from '../../pages/WelcomePage';
import { Teaser } from '../../types/templateEngine';

export const categoryData = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Beauty' },
    { id: 3, name: 'Gardening' },
];

export const registeredUserData = {
    id: '1',
    name: 'John Doe',
    email: 'existing@example.com',
    password: 'password123',
};

const AnonymousUserTemplateEngine = {
    id: 10,
    name: 'John',
    email: 'james@gmail.com',
    email_verified_at: 'string',
};

// from sql user table
const RegisteredUserTemplateEngine = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    email_verified_at: '2024-12-13 07:02:02',
};

const WelcomePageDataTemplateEngine = () => {
    const { data } = WelcomeProps;

    const teasers: Teaser[] = data.filter((teaser) => teaser.type === 'Teaser');
    const teasersWithLinks: Teaser[] = data.filter((teaser) => teaser.type === 'TeaserWithLinks');

    return {
        teasers,
        data,
        teasersWithLinks,
    };
};

export { AnonymousUserTemplateEngine, RegisteredUserTemplateEngine, WelcomePageDataTemplateEngine };
