import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { navigateTo } from '../../utils/testRenderUtils';

describe('BasicMenu', () => {
    const renderUtils = ({route}: {route: string}) => {
        const user = userEvent.setup();

        navigateTo({route}); // Render HomePage

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
            route: '/',
        },
        {
            page: 'ImprintPage',
            route: '/impressum',
        },
        {
            page: 'DatenschutzPage',
            route: '/datenschutz',
        },
        {
            page: 'PlaygroundPage',
            route: '/playground',
        },
    ])(
        'should render a footer on $page with a link to impressum and datenschutz page',
        ({ route }) => {
            const { impressumLink, datenschutzLink } = renderUtils({route});

            expect(impressumLink).toBeInTheDocument();
            expect(datenschutzLink).toBeInTheDocument();
        },
    );
});
