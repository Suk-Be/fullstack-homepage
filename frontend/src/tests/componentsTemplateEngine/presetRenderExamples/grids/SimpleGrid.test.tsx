import SimpleGrid from '@/componentsTemplateEngine/presetRenderExamples/grids/SimpleGrid';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('SimpleGrid', () => {
    const renderUtils = () => {
        const layoutConfig = 'gap-4';
        render(<SimpleGrid layoutGapConfig={layoutConfig} />);
        const container = screen.getByTestId('grid-container');
        return {
            container,
            layoutConfig,
        };
    };
    it('renders the grid container with correct classes', () => {
        const { container, layoutConfig } = renderUtils();

        expect(container).toBeInTheDocument();
        expect(container).toHaveClass(`grid grid-cols-3 xl:grid-cols-5 px-4 py-4 ${layoutConfig}`);
    });

    it('renders right count of children with correct classes', () => {
        const { container } = renderUtils();
        const children = container.children;

        expect(children).toHaveLength(12);
        Array.from(children).forEach((element) => {
            expect(element as HTMLElement).toHaveClass('h-24 bg-gray-light');
        });
    });
});
