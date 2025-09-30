import Footer from '@/components/footer';
import { PathAndReduxState, renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/useScroll', () => ({ default: vi.fn() }));
vi.mock('@/components/RouterLink', () => ({
    default: (props: ComponentProps<'a'>) => <a {...props} />,
}));


describe('Footer', () => {
    const renderUtils = ({ route, preloadedState }: PathAndReduxState) => {
        const user = userEvent.setup();

        renderWithProviders(<Footer />, { route, preloadedState }); // Render HomePage

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
            route: '/template-engine',
            page: 'ProjectTemplateEnginePage',
        },
        {
            route: '/template-engine/presets',
            page: 'ProjectTemplateEnginePresetsPage',
        },
        {
            route: '/playground',
            page: 'PlaygroundPage',
        },
    ])(
        'should render a footer on $page with a link to impressum and datenschutz page if not logged in',
        ({ route }) => {
            const { impressumLink, datenschutzLink } = renderUtils({ route });

            expect(impressumLink).toBeInTheDocument();
            expect(datenschutzLink).toBeInTheDocument();
        },
    );
});
