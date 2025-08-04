import ShowMarkupCode from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup/ShowMarkupCode';
import { render, screen } from '@testing-library/react';

describe('ShowMarkupCode', () => {
    it('renders the component when isShown is true', () => {
        render(<ShowMarkupCode isShown={true} component={<div>Test Component</div>} />);

        const container = screen.getByTestId('markup-component');
        expect(container).toBeInTheDocument();
        expect(container).toHaveTextContent('Test Component');
    });

    it('does not render anything when isShown is false', () => {
        const { container } = render(
            <ShowMarkupCode isShown={false} component={<div>Should not be visible</div>} />,
        );

        expect(container).toBeEmptyDOMElement();
    });
});
