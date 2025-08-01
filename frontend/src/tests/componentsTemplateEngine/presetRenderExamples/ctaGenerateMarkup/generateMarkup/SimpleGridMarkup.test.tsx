import SimpleGridMarkup from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup/generateMarkup/SimpleGridMarkup';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('SimpleGridMarkup', () => {
    it('renders the expected markup text', () => {
        render(<SimpleGridMarkup layoutGapConfig="gap-4" />);
        const styledIOpeningCodeBlock = screen.getByText(/gap-4/);
        const styledICodeBlockItems = screen.getAllByText(/h-24 bg-gray-light/);

        expect(styledIOpeningCodeBlock).toBeInTheDocument();
        expect(styledICodeBlockItems).toHaveLength(12);
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<SimpleGridMarkup layoutGapConfig="gap-2" />);
        expect(asFragment()).toMatchSnapshot();
    });
});
