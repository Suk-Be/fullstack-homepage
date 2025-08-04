import ColspanningGrid from '@/componentsTemplateEngine/presetRenderExamples/grids/ColspanningGrid';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('ColspanningGrid', () => {
    const renderUtils = () => {
        const layoutConfig = 'col-span-2';
        render(<ColspanningGrid layoutConfig={layoutConfig} />);

        const container = screen.getByTestId('col-spannning-grid-container');
        return {
            container,
            layoutConfig,
        };
    };
    it('renders the grid container with correct classes', () => {
        const { container } = renderUtils();

        expect(container).toBeInTheDocument();
        expect(container).toHaveClass('grid grid-cols-3 xl:grid-cols-3 gap-4 px-4 py-4');
    });

    it('renders exactly 6 GridElement children with correct classes', () => {
        const { container, layoutConfig } = renderUtils();
        const children = container.children;

        expect(children).toHaveLength(6);

        expect(children[0]).toHaveClass('h-24 bg-green-dark');
        expect(children[1]).toHaveClass('h-24 bg-green', layoutConfig);
        expect(children[2]).toHaveClass('h-24 bg-green', layoutConfig);
        expect(children[3]).toHaveClass('h-24 bg-green-dark');
        expect(children[4]).toHaveClass('h-24 bg-green-dark');
        expect(children[5]).toHaveClass('h-24 bg-green', layoutConfig);
    });
});
