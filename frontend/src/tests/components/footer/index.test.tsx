import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { navigateTo } from '../../utils/testRenderUtils';

describe('BasicMenu', () => {
    const renderUtils = (path: string) => {
        const user = userEvent.setup();

        navigateTo(path); // Render HomePage

        const impressumLink = screen.getByTestId('link-impressum-page');
        const datenschutzLink = screen.getByTestId('link-datenschutz-page');

        return {
            user,
            impressumLink,
            datenschutzLink,
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
            page: 'DatenschutzPage',
            link: '/datenschutz',
        },
        {
            page: 'PlaygroundPage',
            link: '/playground',
        },
    ])(
        'should render a footer on $page with a link to impressum and datenschutz page',
        ({ link }) => {
            const { impressumLink, datenschutzLink } = renderUtils(link);

            expect(impressumLink).toBeInTheDocument();
            expect(datenschutzLink).toBeInTheDocument();
        },
    );
});
