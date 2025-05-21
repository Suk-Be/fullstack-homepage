import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { navigateTo } from '../../utils';

describe('BasicMenu', () => {
    const renderUtils = (path: string) => {
        navigateTo(path);

        const impressumLink = screen.getByTestId('link-impressum-page');

        return {
            impressumLink,
        };
    };

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
    ])('should render a footer on $page with a link to impressum page', ({ link }) => {
        const { impressumLink } = renderUtils(link);

        expect(impressumLink).toBeInTheDocument();
    });
});
