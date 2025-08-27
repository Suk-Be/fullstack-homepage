import calculateAndFormatFraction from '@/utils/templateEngine/inlineStylesToTailwindClasses/calculateAndFormatFraction';
import translateInlineStyleValuesToTailwindValues from '@/utils/templateEngine/inlineStylesToTailwindClasses/translateInlineStyleValuesToTailwindValues';
import { describe, expect, it, Mock, vi } from 'vitest';

vi.mock('@/utils/templateEngine/inlineStylesToTailwindClasses/calculateAndFormatFraction', () => ({
    default: vi.fn(),
}));

describe('translateInlineStyleValuesToTailwindValues', () => {
    const mockedCalculateAndFormatFraction = calculateAndFormatFraction as Mock;

    const InlineStyleRulesArray = [
        'display:grid',
        'grid-template-columns:repeat(4, minmax(0, 1fr))',
        'gap:3px',
        'border-width:calc(2rem/3)',
        'padding:calc(2rem/2) calc(3rem/2)',
    ];

    beforeEach(() => {
        mockedCalculateAndFormatFraction.mockClear();
    });

    it('should correctly extract and format grid column value', () => {
        const styleType = { isGridCol: true };
        const styleRule = 'grid-template-columns'; // Der Teil, nach dem gesucht wird

        const result = translateInlineStyleValuesToTailwindValues(
            styleRule,
            styleType,
            InlineStyleRulesArray,
        );

        expect(result).toBe('4');
    });

    it('should correctly extract and format gap value', () => {
        const styleType = { isGap: true };
        const styleRule = 'gap';

        const result = translateInlineStyleValuesToTailwindValues(
            styleRule,
            styleType,
            InlineStyleRulesArray,
        );

        expect(result).toBe('[3px]');
    });

    it('should correctly extract and format border-width value', () => {
        const styleType = { isBorder: true };
        const styleRule = 'border-width';

        mockedCalculateAndFormatFraction.mockReturnValueOnce('0.67'); // 2/3 gerundet

        const result = translateInlineStyleValuesToTailwindValues(
            styleRule,
            styleType,
            InlineStyleRulesArray,
        );

        expect(result).toBe('[0.67rem]');
        expect(mockedCalculateAndFormatFraction).toHaveBeenCalledWith('2/3');
    });

    it('should correctly extract and format padding values (isPadding)', () => {
        const styleType = { isPadding: true };
        const styleRule = 'padding';

        mockedCalculateAndFormatFraction.mockReturnValueOnce('1.5'); // Für 3rem/2
        mockedCalculateAndFormatFraction.mockReturnValueOnce('1'); // Für 2rem/2

        const result = translateInlineStyleValuesToTailwindValues(
            styleRule,
            styleType,
            InlineStyleRulesArray,
        );

        expect(result).toEqual(['[1.5rem]', '[1rem]']); // Beachte die Reihenfolge im Code: px dann py
        expect(mockedCalculateAndFormatFraction).toHaveBeenCalledWith('3/2');
        expect(mockedCalculateAndFormatFraction).toHaveBeenCalledWith('2/2');
    });

    it('should return undefined if no matching rule is found', () => {
        const styleType = { isGridCol: true };
        const styleRule = 'non-existent-rule';

        const result = translateInlineStyleValuesToTailwindValues(
            styleRule,
            styleType,
            InlineStyleRulesArray,
        );

        expect(result).toBeUndefined();
    });

    it('should return undefined if InlineStyleRulesArray is null or undefined', () => {
        const styleType = { isGridCol: true };
        const styleRule = 'grid-template-columns';

        let result = translateInlineStyleValuesToTailwindValues(styleRule, styleType, null);
        expect(result).toBeUndefined();

        result = translateInlineStyleValuesToTailwindValues(styleRule, styleType, undefined);
        expect(result).toBeUndefined();
    });

    it('should return undefined if no styleType is true', () => {
        const styleType = {}; // Kein isGridCol, isGap, isBorder, isPadding
        const styleRule = 'display';

        const result = translateInlineStyleValuesToTailwindValues(
            styleRule,
            styleType,
            InlineStyleRulesArray,
        );

        expect(result).toBeUndefined();
    });
});
