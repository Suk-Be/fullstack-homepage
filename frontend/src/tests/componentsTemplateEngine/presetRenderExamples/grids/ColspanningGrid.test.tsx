import ColspanningGrid from '@/componentsTemplateEngine/presetRenderExamples/grids/ColspanningGrid';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('ColspanningGrid', () => {
    it('applies layoutConfig class to specific GridElements', () => {
        const layoutConfig = 'col-span-2';

        render(<ColspanningGrid layoutConfig={layoutConfig} />);

        const gridContainer = screen.getByTestId('col-spannning-grid-container');
        expect(gridContainer).toBeInTheDocument();

        const layoutConfigApplied = gridContainer.querySelectorAll(`.${layoutConfig}`);
        expect(layoutConfigApplied).toHaveLength(3);
    });
});
