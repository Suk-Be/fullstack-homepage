import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { navigateTo } from '../../utils';

describe('BasicMenu', () => {
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
    ])('should render a footer on $page with a link to impressum page', async ({ link }) => {
        navigateTo(link);

        const impressumLink = await screen.findByRole('link', {
            name: /impressum/i,
        });

        expect(impressumLink).toBeInTheDocument();
    });
});
