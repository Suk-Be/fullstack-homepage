import GridMarkupWrapper from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup/generateMarkup/GridMarkupWrapper';
import { render, screen, within } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

const TestComponent = () => <section className="example">Test</section>;

vi.mock('@/utils/templateEngine/parseHtmlToText', () => ({
    toTextOpeningTagFrom: () => '<section class="example">',
    toTextClosingTagFrom: () => '</section>',
}));

describe('GridMarkupWrapper', () => {
    it('renders opening tag, children tags, and closing tag correctly', () => {
        const childrenTags = ['<div>Child 1</div>', '<div>Child 2</div>'];

        render(
            <GridMarkupWrapper
                markupComponent={<TestComponent />}
                childrenTagsArr={childrenTags}
                className="custom-class"
            />,
        );

        // screen.debug(screen.getByTestId('grid-markup-wrapper'));

        // Opening tag
        const codeBlocks = screen.getAllByRole('code');
        expect(codeBlocks).toHaveLength(3);

        // Prüfe Opening Tag (escaped)
        expect(codeBlocks[0]).toHaveTextContent('<section class="example">');

        // Prüfe Children Tags (escaped)
        const childrenCodeBlock = codeBlocks[1];
        const child1 = within(childrenCodeBlock).getByText('<div>Child 1</div>');
        const child2 = within(childrenCodeBlock).getByText('<div>Child 2</div>');
        expect(child1).toBeInTheDocument();
        expect(child2).toBeInTheDocument();

        // Prüfe Closing Tag (escaped)
        expect(codeBlocks[2]).toHaveTextContent('</section>');

        // Wrapper-DIV Klasse prüfen
        const wrapper = screen.getByTestId('grid-markup-wrapper');
        expect(wrapper).toHaveClass('grid', 'p-4', 'custom-class');
    });
});
