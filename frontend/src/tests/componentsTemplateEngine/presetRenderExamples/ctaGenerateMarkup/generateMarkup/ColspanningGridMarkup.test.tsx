import ColspanningGridMarkup from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup/generateMarkup/ColspanningGridMarkup';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('ColspanningGridMarkup', () => {
    it('renders the expected markup text', () => {
        render(<ColspanningGridMarkup layoutConfig="col-span-2" />);
        const styledIOpeningCodeBlock = screen.getByText(/col-spannning-grid-container/);
        const styledICodeBlockItems = screen.getAllByText(
            (content) =>
                content.includes('h-24 bg-green') || content.includes('h-24 bg-green-dark'),
        );

        expect(styledIOpeningCodeBlock).toBeInTheDocument();
        expect(styledICodeBlockItems).toHaveLength(6);
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<ColspanningGridMarkup layoutConfig="col-span-2" />);
        expect(asFragment()).toMatchSnapshot();
    });
});
