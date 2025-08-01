import SimpleGrid from '@/componentsTemplateEngine/presetRenderExamples/SimpleGrid';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
    '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/GridElement',
    () => ({
        default: ({ className }: { className: string }) => (
            <div data-testid="grid-element" className={className}>
                GridElement
            </div>
        ),
    }),
);

describe('SimpleGrid', () => {
    it('should render 12 GridElement components', () => {
        render(<SimpleGrid />);

        const gridElements = screen.getAllByTestId('grid-element');

        expect(gridElements).toHaveLength(12);
    });

    it('should apply the layoutGapConfig class to each GridElement', () => {
        render(<SimpleGrid layoutGapConfig="gap-4" />);

        const gridElements = screen.getAllByTestId('grid-element');

        expect(gridElements[0].className).toContain('h-24 bg-gray-light');
    });
});
