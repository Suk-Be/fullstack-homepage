import ChildrenTags from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/ChildrenTags';
import { render, screen } from '@testing-library/react';

describe('ChildrenTags', () => {
    const renderUtils = (arr: string[] = []) => {
        render(<ChildrenTags arr={arr} />);
    };

    it('renders all array entries as divs inside a code block', () => {
        const testArr = ['one', 'two', 'three'];

        renderUtils(testArr);

        // children habe einen code container
        const codeElement = screen.getByText('one').parentElement;
        expect(codeElement).toBeInTheDocument();
        expect(codeElement).toHaveClass('block pl-4');
        expect(codeElement?.tagName.toLowerCase()).toBe('code');

        // alle Array Einträge werden als div gerendert
        testArr.forEach((text) => {
            const div = screen.getByText(text);
            expect(div).toBeInTheDocument();
            expect(div.tagName.toLowerCase()).toBe('div');
        });

        // Anzahl der divs entspricht arr.length
        const divs = codeElement?.querySelectorAll('div');
        expect(divs?.length).toBe(testArr.length);
    });

    it('renders nothing when arr is empty', () => {
        const { container } = render(<ChildrenTags arr={[]} />);

        const codeElement = container.querySelector('code');

        expect(codeElement).toBeInTheDocument(); // code block ist leer
        expect(codeElement?.textContent).toBe('');
    });

    it('escapes HTML characters properly', () => {
        const htmlStrings = ['&lt;div&gt;', '&nbsp;', '"quote"'];

        renderUtils(htmlStrings);

        htmlStrings.forEach((text) => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });
});
