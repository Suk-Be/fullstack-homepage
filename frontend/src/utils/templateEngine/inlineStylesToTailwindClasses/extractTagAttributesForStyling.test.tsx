import extractTagAttributesForStyling from '@/utils/templateEngine/inlineStylesToTailwindClasses/extractTagAttributesForStyling';
import { toTextOpeningTagFrom } from '@/utils/templateEngine/parseHtmlToText';
import { describe, expect, it, Mock, vi } from 'vitest';

// Mockt die internen Abhängigkeit 'toTextOpeningTagFrom'
vi.mock('@/utils/templateEngine/parseHtmlToText', () => ({
    toTextOpeningTagFrom: vi.fn(),
    createHtmlAsTextFromPassedComponent: vi.fn(),
    parseStringToADomModel: vi.fn(),
    toTextParentNode: vi.fn(),
    toTextClosingTagFrom: vi.fn(),
}));

const MockComponent = () => <div>Test</div>;

describe('extractTagAttributes', () => {
    // toTextOpeningTagFrom Mock
    const mockedToTextOpeningTagFrom = toTextOpeningTagFrom as Mock;
    beforeEach(() => {
        mockedToTextOpeningTagFrom.mockClear();
    });

    it('should correctly extract class and style attributes', () => {
        const mockOpeningTag = `<div class="grid border-gray-light/25" style="display: grid; gap: 1rem;">`;
        mockedToTextOpeningTagFrom.mockReturnValue(mockOpeningTag);

        // Extrahiert style und class attribute
        const result = extractTagAttributesForStyling(<MockComponent />);

        expect(result.classAttributes).toEqual(['class="grid border-gray-light/25"']);
        expect(result.styleAttributes).toEqual(['style="display: grid; gap: 1rem;"']);
    });

    it('should return null for style and class if attributes are not present', () => {
        const mockOpeningTag = `<div data-testid="test-div">`;
        mockedToTextOpeningTagFrom.mockReturnValue(mockOpeningTag);

        const result = extractTagAttributesForStyling(<MockComponent />);

        expect(result.classAttributes).toBeNull();
        expect(result.styleAttributes).toBeNull();
    });

    it('should handle attributes with different values and formats', () => {
        const mockOpeningTag = `<div style="padding: 10px;" class="bg-blue-500">`;
        mockedToTextOpeningTagFrom.mockReturnValue(mockOpeningTag);

        const result = extractTagAttributesForStyling(<MockComponent />);

        expect(result.classAttributes).toEqual(['class="bg-blue-500"']);
        expect(result.styleAttributes).toEqual(['style="padding: 10px;"']);
    });

    it('should return null if the opening tag is empty', () => {
        mockedToTextOpeningTagFrom.mockReturnValue('');

        const result = extractTagAttributesForStyling(<MockComponent />);

        expect(result.classAttributes).toBeNull();
        expect(result.styleAttributes).toBeNull();
    });
});
