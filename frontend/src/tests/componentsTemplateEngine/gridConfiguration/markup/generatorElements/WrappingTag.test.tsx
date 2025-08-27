import {
    ClosingTag,
    OpeningTag,
    WrappingTag,
} from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/WrappingTag';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@/utils/templateEngine/parseHtmlToText', () => ({
    toTextOpeningTagFrom: vi.fn(() => '<div>'),
    toTextClosingTagFrom: vi.fn(() => '</div>'),
}));

describe('WrappingTag', () => {
    const dummyComponent = <div className="dummy" />;

    it('renders opening tag when isOpeningTag is true', () => {
        render(<WrappingTag component={dummyComponent} isOpeningTag />);

        const code = screen.getByText('<div>');
        expect(code).toBeInTheDocument();
        expect(code.tagName.toLowerCase()).toBe('code');
        expect(code).toHaveClass('block pb-4');
    });

    it('renders closing tag when isClosingTag is true', () => {
        render(<WrappingTag component={dummyComponent} isClosingTag />);

        const code = screen.getByText('</div>');
        expect(code).toBeInTheDocument();
        expect(code.tagName.toLowerCase()).toBe('code');
        expect(code).toHaveClass('block pt-4');
    });

    it('renders nothing when neither isOpeningTag nor isClosingTag is true', () => {
        const { container } = render(<WrappingTag component={dummyComponent} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('OpeningTag renders correctly', () => {
        render(<OpeningTag component={dummyComponent} />);
        expect(screen.getByText('<div>')).toBeInTheDocument();
    });

    it('ClosingTag renders correctly', () => {
        render(<ClosingTag component={dummyComponent} />);
        expect(screen.getByText('</div>')).toBeInTheDocument();
    });
});
