import CreateGridMarkup from '@/componentsTemplateEngine/gridConfiguration/markUp/CreateGridMarkUp';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('CreateGridMarkup', () => {
    it('should render the markup container with markup containers for grid styles (opening tag), grid items (children tags) and closing tag', () => {
        const DummyComponent = () => (
            <div className="bg-red-500 p-4">
                <h1>Hello World</h1>
                <p>This is a test</p>
            </div>
        );

        render(<CreateGridMarkup Component={<DummyComponent />} />);

        const markupContainer = screen.getByTestId('create-grid-markup');
        const openingTagContainer = screen.getByTestId('opening-tag-inline-style');
        const childrenTagsContainer = screen.getByTestId('children-tags-container');
        const closingTagContainer = screen.getByTestId('closing-tag');
        expect(markupContainer).toBeInTheDocument();
        expect(openingTagContainer).toBeInTheDocument();
        expect(childrenTagsContainer).toBeInTheDocument();
        expect(closingTagContainer).toBeInTheDocument();

        expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
        expect(screen.getByText(/This is a test/i)).toBeInTheDocument();

        // Opening/Closing-Tags – wenn sie Text zeigen
        expect(screen.getByText(/<div class=".*">/i)).toBeInTheDocument(); // OpeningTag mit Tailwind-Klassen
        expect(screen.getByText(/<\/div>/i)).toBeInTheDocument(); // ClosingTag
    });
});
