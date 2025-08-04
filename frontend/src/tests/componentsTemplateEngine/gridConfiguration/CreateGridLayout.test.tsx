import CreateGridLayout from '@/componentsTemplateEngine/gridConfiguration/CreateGridLayout';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock(
    '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/GridElement',
    () => ({
        __esModule: true,
        default: ({ id, className }: { id: string; className: string }) => (
            <div data-testid="grid-element" id={id} key={id} className={className} />
        ),
    }),
);

describe('CreateGridLayout', () => {
    it('renders dynamic grid with correct number of GridElements and styles', () => {
        const arr = [1, 2, 3];
        const style = {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
        };

        render(<CreateGridLayout arr={arr} style={style} />);

        const container = screen.getByTestId('dynamic-grid');

        expect(container).toBeInTheDocument();

        expect(container).toHaveStyle({
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
        });

        const gridElements = screen.getAllByTestId('grid-element');
        expect(gridElements).toHaveLength(arr.length);

        arr.forEach((val, index) => {
            expect(gridElements[index]).toHaveAttribute('id', val.toString());
            expect(gridElements[index].className).toContain(
                'w-[32px] h-[24px] md:w-[84px] md:h-[61px] lg:w-[100px] lg:h-[75px] xl:w-32 xl:h-24 bg-gray rounded-sm md:rounded-xl',
            );
        });
    });
});
