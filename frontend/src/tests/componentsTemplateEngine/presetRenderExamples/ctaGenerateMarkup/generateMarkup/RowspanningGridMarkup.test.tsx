import RowspanningGridMarkup from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup/generateMarkup/RowspanningGridMarkup';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Opening/Closing Tags
vi.mock('@/utils/templateEngine/parseHtmlToText', () => ({
    toTextOpeningTagFrom: () => '<div class="grid grid-cols-3 gap-4">',
    toTextClosingTagFrom: () => '</div>',
}));

// childrenTagsArr (z. B. divs innerhalb des Grids)
vi.mock('@/utils/templateEngine/parseHtmlToText/rowSpanningGridItemTagsToText', () => ({
    default: [
        '<div class="col-span-2">Content 1</div>',
        '<div class="row-span-2">Content 2</div>',
        '<div>Content 3</div>',
    ],
}));

// Dummy RowspanningGrid, falls es keine echte Ausgabe hat
vi.mock('@/componentsTemplateEngine/presetRenderExamples/grids/RowspanningGrid', () => ({
    __esModule: true,
    default: () => <div data-testid="rowspanning-grid">Grid content</div>,
}));

describe('RowspanningGridMarkup', () => {
    it('renders the RowspanningGrid opening/closing tags and child tags', () => {
        render(<RowspanningGridMarkup />);

        // screen.debug();

        // Check that opening tag appears (div escaped)
        expect(screen.getByText('<div class="grid grid-cols-3 gap-4">')).toBeInTheDocument();

        // Check that children tags are rendered correctly (div escaped)
        const childrenCodeBlock = screen
            .getByText('<div class="col-span-2">Content 1</div>')
            .closest('code');
        expect(childrenCodeBlock).toBeInTheDocument();

        // Check all mocked children tags (div escaped)
        expect(
            within(childrenCodeBlock!).getByText('<div class="col-span-2">Content 1</div>'),
        ).toBeInTheDocument();
        expect(
            within(childrenCodeBlock!).getByText('<div class="row-span-2">Content 2</div>'),
        ).toBeInTheDocument();
        expect(within(childrenCodeBlock!).getByText('<div>Content 3</div>')).toBeInTheDocument();

        // Check closing tag (div escaped)
        expect(screen.getByText('</div>')).toBeInTheDocument();
    });
});
