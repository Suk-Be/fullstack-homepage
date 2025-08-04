import RowspanningGrid from '@/componentsTemplateEngine/presetRenderExamples/grids/RowspanningGrid';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('RowspanningGrid', () => {
    it('renders the grid container with correct classes', () => {
        render(<RowspanningGrid />);

        const container = screen.getByTestId('row-spannning-grid-container');

        expect(container).toBeInTheDocument();
        expect(container).toHaveClass(
            'grid',
            'grid-rows-3',
            'grid-flow-col',
            'gap-4',
            'px-4',
            'py-4',
            'leading-10',
        );
    });

    it('renders exactly 3 GridElement children with correct classes', () => {
        render(<RowspanningGrid />);

        const container = screen.getByTestId('row-spannning-grid-container');
        const children = container.children;

        expect(children).toHaveLength(3);

        expect(children[0]).toHaveClass('p-12', 'bg-green-dark', 'row-span-3');
        expect(children[1]).toHaveClass('p-12', 'bg-green', 'col-span-2');
        expect(children[2]).toHaveClass('p-12', 'bg-green-dark/80', 'row-span-2', 'col-span-2');
    });
});
