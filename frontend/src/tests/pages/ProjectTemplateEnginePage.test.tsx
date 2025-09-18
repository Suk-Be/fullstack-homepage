import ProjectTemplateEnginePage from '@/pages/ProjectTemplateEnginePage';
import { initialState as userSaveGridsInitialState } from '@/store/userSaveGridsSlice';
import { userLoggedAdmin } from '@/tests/mocks/api';
import { renderWithProvidersDOM } from '@/tests/utils/testRenderUtils';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('ProjectTemplateEnginePage', () => {
    const renderUtils = () => {
        renderWithProvidersDOM(<ProjectTemplateEnginePage />, {
            route: '/template-engine',
            preloadedState: {
                login: {
                    isLoggedIn: true,
                    isLoading: false,
                },
                userGrid: {
                    ...userSaveGridsInitialState,
                    userId: userLoggedAdmin,
                },
            },
        });

        return {
            asideLeft: screen.getByTestId('aside-left'),
            contentCenter: screen.getByTestId('content-center'),
            asideRight: screen.getByTestId('aside-right'),
        };
    };

    it('should render the structure of the template engine page', () => {
        const { asideLeft, contentCenter, asideRight } = renderUtils();

        expect(screen.getByTestId('main-container')).toBeInTheDocument();
        // within main container
        expect(asideLeft).toBeInTheDocument();
        expect(contentCenter).toBeInTheDocument();
        expect(asideRight).toBeInTheDocument();
    });

    it('renders grid configuration with default values', () => {
        const { asideLeft } = renderUtils();

        // within aside left
        expect(asideLeft).toBeInTheDocument();

        expect(screen.getByTestId('grid-configuration')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Layout', level: 2 })).toBeInTheDocument();

        const gridItemsLabel = screen.getByTestId('items-display-value');
        expect(gridItemsLabel).toHaveTextContent('1');
        const gridItemsInput = screen.getByTestId('items-value');
        expect(gridItemsInput).toHaveValue('1');

        const gridColumnsLabel = screen.getByTestId('columns-display-value');
        expect(gridColumnsLabel).toHaveTextContent('1');
        const gridColumnsInput = screen.getByTestId('columns-value');
        expect(gridColumnsInput).toHaveValue('1');
    });

    it('renders gap configuration with default values', () => {
        const { asideLeft } = renderUtils();

        // within aside left
        expect(asideLeft).toBeInTheDocument();

        expect(screen.getByTestId('gap-configuration')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Options', level: 2 })).toBeInTheDocument();

        const gapLabel = screen.getByTestId('gap-display-value');
        expect(gapLabel).toHaveTextContent('0');
        const gapInput = screen.getByTestId('gap-value');
        expect(gapInput).toHaveValue('0');

        expect(screen.getByText('Unit: px')).toBeInTheDocument();
    });

    it('renders boder configuration with default values', () => {
        const { asideLeft } = renderUtils();

        // within aside left
        expect(asideLeft).toBeInTheDocument();

        expect(screen.getByTestId('border-configuration')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Border', level: 2 })).toBeInTheDocument();

        const borderLabel = screen.getByTestId('border-display-value');
        expect(borderLabel).toHaveTextContent('0');
        const borderInput = screen.getByTestId('border-value');
        expect(borderInput).toHaveValue('0');

        expect(screen.getByText('Unit: rem/3')).toBeInTheDocument();
    });

    it('renders padding configuration with default values', () => {
        const { asideLeft } = renderUtils();

        // within aside left
        expect(asideLeft).toBeInTheDocument();

        expect(screen.getByTestId('padding-configuration')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Padding', level: 2 })).toBeInTheDocument();

        const horizontalLabel = screen.getByTestId('horizontal-display-value');
        expect(horizontalLabel).toHaveTextContent('0');
        const horizontalInput = screen.getByTestId('horizontal-value');
        expect(horizontalInput).toHaveValue('0');

        const verticalLabel = screen.getByTestId('vertical-display-value');
        expect(verticalLabel).toHaveTextContent('0');
        const verticalInput = screen.getByTestId('vertical-value');
        expect(verticalInput).toHaveValue('0');

        expect(screen.getByText('Unit: rem/2')).toBeInTheDocument();
    });

    it('renders initial content with default amount of grid items', () => {
        const { contentCenter } = renderUtils();
        const dynamicGridContainer = screen.getByTestId('dynamic-grid');

        // within content center
        expect(contentCenter).toBeInTheDocument();
        expect(dynamicGridContainer).toBeInTheDocument();
        expect(dynamicGridContainer.childElementCount).toBe(1);
    });

    it('renders with teasers: Link to Example Grids, Save this Grid and Generate HTML', () => {
        const { asideRight } = renderUtils();

        // within aside right
        expect(asideRight).toBeInTheDocument();

        // Example Layout Grids
        expect(
            screen.getByRole('heading', { name: 'Layout Example Grids', level: 2 }),
        ).toBeInTheDocument();
        expect(screen.getByTestId('layout-example-teaser')).toBeInTheDocument();
        const link = screen.getByRole('link', { name: /browse examples/i });
        expect(link).toHaveAttribute('href', '/template-engine/presets');

        // Generate HTML
        expect(
            screen.getByRole('heading', { name: 'Generate HTML', level: 2 }),
        ).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'HTML + Tailwind' })).toBeInTheDocument();

        // Save this Grid
        expect(
            screen.getByRole('heading', { name: 'Save this Grid', level: 2 }),
        ).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /meaningful name/i })).toBeInTheDocument();
    });
});
