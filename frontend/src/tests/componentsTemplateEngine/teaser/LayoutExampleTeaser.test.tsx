import LayoutExampleTeaser from '@/componentsTemplateEngine/teaser/LayoutExampleTeaser';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock(
    '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/GridElement',
    () => ({
        __esModule: true,
        default: ({ className }: { className: string }) => (
            <div data-testid="grid-element" className={className} />
        ),
    }),
);

describe('LayoutExampleTeaser', () => {
    it('renders the teaser grid correctly', () => {
        render(<LayoutExampleTeaser />);

        const container = screen.getByTestId('grid-eample-teaser');

        expect(container).toBeInTheDocument();
        expect(container).toHaveAttribute('role', 'img');
        expect(container).toHaveAttribute('aria-label', 'presets-grid-image');
        const gridElements = screen.getAllByTestId('grid-element');
        expect(gridElements).toHaveLength(6);
        const expectedClasses =
            'grid grid-cols-3 xl:grid-cols-3 gap-2 py-4 group-hover:scale-[1.02] transition-all transform';
        expect(container.className).toContain(expectedClasses);
    });
});
