import TeaserGenerateMarkup from '@/componentsTemplateEngine/teaser/GenerateMarkupTeaser';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('TeaserGenerateMarkup', () => {
    const toggled = false;

    const mockInlineStyles = {
        display: 'grid',
        gridTemplateColumns: `repeat(1, minmax(0, 1fr))`,
        gap: '0px',
        borderWidth: toggled ? '0rem/3' : '0rem',
        padding: 'calc(0rem/2) calc(0rem/2)',
    };

    const mockGridItemsArray = [1];

    it('should render a headline and a button"', () => {
        render(
            <TeaserGenerateMarkup
                inlineStyles={mockInlineStyles}
                gridItemsArray={mockGridItemsArray}
            />,
        );
        const openButton = screen.getByRole('button', { name: /html \+ tailwind/i });
        expect(openButton).toBeInTheDocument();
        expect(screen.getByText('Erstelle HTML')).toBeInTheDocument();
    });
});
