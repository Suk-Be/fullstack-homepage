import OpeningTagWithTranspiledTailwindClasses from '@/componentsTemplateEngine/gridConfiguration/markUp/OpeningTagWithTranspiledTailwindClasses';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, Mock, vi } from 'vitest';

// Mocke alle internen Abhängigkeiten der Komponente
import {
    borderWidthValue,
    colValue,
    gapValue,
    paddingValues,
} from '@/utils/templateEngine/inlineStylesToTailwindClasses/ExtractedStyleRuleValue';
import separateStyleRulesArray from '@/utils/templateEngine/inlineStylesToTailwindClasses/SeparateStyleRulesArray';
import extractTagAttributesForStyling from '@/utils/templateEngine/inlineStylesToTailwindClasses/extractTagAttributesForStyling';
import { toTextOpeningTagFrom } from '@/utils/templateEngine/parseHtmlToText';

// Mock-Implementierung der Abhängigkeiten
vi.mock('@/utils/templateEngine/inlineStylesToTailwindClasses/extractedStyleRuleValue', () => ({
    borderWidthValue: vi.fn(),
    colValue: vi.fn(),
    gapValue: vi.fn(),
    paddingValues: vi.fn(),
}));
vi.mock(
    '@/utils/templateEngine/inlineStylesToTailwindClasses/extractTagAttributesForStyling',
    () => ({
        default: vi.fn(),
    }),
);
vi.mock('@/utils/templateEngine/inlineStylesToTailwindClasses/separateStyleRulesArray', () => ({
    default: vi.fn(),
}));
vi.mock('@/utils/templateEngine/parseHtmlToText', () => ({
    toTextOpeningTagFrom: vi.fn(),
}));

const MockComponent = () => <div />;

describe('OpeningTagWithTranspiledTailwindClasses', () => {
    // Definieren der Mock-Funktionen
    const mockedExtractTagAttributes = extractTagAttributesForStyling as Mock;
    const mockedSeparateStyleRulesArray = separateStyleRulesArray as Mock;
    const mockedToTextOpeningTagFrom = toTextOpeningTagFrom as Mock;
    const mockedGridColumnValue = colValue as Mock;
    const mockedGridGapValue = gapValue as Mock;
    const mockedGridBorderWidthValue = borderWidthValue as Mock;
    const mockedPadValues = paddingValues as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should correctly transpile and render dynamic inline styles to tailwind classes', () => {
        mockedExtractTagAttributes.mockReturnValue({
            styleAttributes: ['style="some:value;"'],
            classAttributes: null,
        });
        mockedSeparateStyleRulesArray.mockReturnValue([
            'display:grid',
            'grid-template-columns:repeat(4, minmax(0, 1fr))',
            'gap:3px',
            'border-width:calc(2rem/3)',
            'padding:calc(2rem/2) calc(3rem/2)',
        ]);
        mockedGridColumnValue.mockReturnValue('4');
        mockedGridGapValue.mockReturnValue('[3px]');
        mockedGridBorderWidthValue.mockReturnValue('[0.67rem]');
        mockedPadValues.mockReturnValue(['[1.5rem]', '[1rem]']);
        mockedToTextOpeningTagFrom.mockReturnValue(
            `<div class="grid border-gray-light/25 col-span-4 gap-[3px] border-[0.67rem] px-[1.5rem] py-[1rem]">`,
        );

        const props = {
            isDynamicInlineStyle: true,
            Component: <MockComponent />,
        };

        render(<OpeningTagWithTranspiledTailwindClasses {...props} />);

        const openingTagElement = screen.getByTestId('opening-tag-inline-style');

        expect(openingTagElement).toBeInTheDocument();
        expect(openingTagElement).toHaveTextContent(
            `<div class="grid border-gray-light/25 col-span-4 gap-[3px] border-[0.67rem] px-[1.5rem] py-[1rem]">`,
        );

        expect(mockedExtractTagAttributes).toHaveBeenCalledWith(<MockComponent />);
        expect(mockedSeparateStyleRulesArray).toHaveBeenCalledWith(['style="some:value;"']);
        expect(mockedGridColumnValue).toHaveBeenCalledWith([
            'display:grid',
            'grid-template-columns:repeat(4, minmax(0, 1fr))',
            'gap:3px',
            'border-width:calc(2rem/3)',
            'padding:calc(2rem/2) calc(3rem/2)',
        ]);
        // ... und so weiter für alle Helfer
    });

    it('should return null when isDynamicInlineStyle is false', () => {
        const props = {
            isDynamicInlineStyle: false,
            Component: <MockComponent />,
        };

        render(<OpeningTagWithTranspiledTailwindClasses {...props} />);

        const openingTagElement = screen.getByTestId('opening-tag-inline-style');

        expect(openingTagElement).toBeInTheDocument();
        expect(openingTagElement).toHaveTextContent('');

        expect(mockedExtractTagAttributes).not.toHaveBeenCalled();
        expect(mockedSeparateStyleRulesArray).not.toHaveBeenCalled();
    });

    it('should return an empty string when a required value is missing from the transpilation process', () => {
        mockedExtractTagAttributes.mockReturnValue({ styleAttributes: ['style="some:value;"'] });
        mockedSeparateStyleRulesArray.mockReturnValue(['display:grid']);
        mockedGridColumnValue.mockReturnValue('4');
        mockedGridGapValue.mockReturnValue(undefined); // Simuliert einen fehlenden Wert
        mockedGridBorderWidthValue.mockReturnValue('[0.67rem]');
        mockedPadValues.mockReturnValue(['[1.5rem]', '[1rem]']);

        mockedToTextOpeningTagFrom.mockReturnValue('');

        const props = {
            isDynamicInlineStyle: true,
            Component: <MockComponent />,
        };

        render(<OpeningTagWithTranspiledTailwindClasses {...props} />);

        const openingTagElement = screen.getByTestId('opening-tag-inline-style');

        // screen.debug(openingTagElement);

        expect(openingTagElement).toBeEmptyDOMElement();
    });
});
