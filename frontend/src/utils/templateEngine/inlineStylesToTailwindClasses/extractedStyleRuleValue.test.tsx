import {
    borderWidthValue,
    colValue,
    gapValue,
    paddingValues,
} from '@/utils/templateEngine/inlineStylesToTailwindClasses/extractedStyleRuleValue';
import tranlateInlineStyleValuesToTailwindValues from '@/utils/templateEngine/inlineStylesToTailwindClasses/translateInlineStyleValuesToTailwindValues';
import { describe, expect, it, Mock, vi } from 'vitest';

// Mocken der Haupt-Utility, die von den Helfern aufgerufen wird
vi.mock(
    '@/utils/templateEngine/inlineStylesToTailwindClasses/translateInlineStyleValuesToTailwindValues',
    () => ({
        default: vi.fn(),
    }),
);

// Dummy-Daten für den Test
const InlineStyleRulesArray = [
    'display:grid',
    'grid-template-columns:repeat(4, minmax(0, 1fr))',
    'gap:3px',
    'border-width:calc(2rem/3)',
    'padding:calc(2rem/2) calc(3rem/2)',
];

describe('extractedStyleRuleValue', () => {
    // Holen Sie sich eine Referenz auf die gemockte Funktion und ihre Typisierung
    const mockedTranslateFn = tranlateInlineStyleValuesToTailwindValues as Mock;

    // Setzen Sie den Mock vor jedem Test zurück
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call tranlateInlineStyleValuesToTailwindValues with correct args for colValue', () => {
        colValue(InlineStyleRulesArray);

        expect(mockedTranslateFn).toHaveBeenCalledWith(
            'grid-template-columns:',
            { isGridCol: true, isGap: false, isBorder: false, isPadding: false },
            InlineStyleRulesArray,
        );
    });

    it('should call tranlateInlineStyleValuesToTailwindValues with correct args for gapValue', () => {
        gapValue(InlineStyleRulesArray);

        expect(mockedTranslateFn).toHaveBeenCalledWith(
            'gap:',
            { isGridCol: false, isGap: true, isBorder: false, isPadding: false },
            InlineStyleRulesArray,
        );
    });

    it('should call tranlateInlineStyleValuesToTailwindValues with correct args for borderWidthValue', () => {
        borderWidthValue(InlineStyleRulesArray);

        expect(mockedTranslateFn).toHaveBeenCalledWith(
            'border-width:',
            { isGridCol: false, isGap: false, isBorder: true, isPadding: false },
            InlineStyleRulesArray,
        );
    });

    it('should call tranlateInlineStyleValuesToTailwindValues with correct args for paddingValues', () => {
        paddingValues(InlineStyleRulesArray);

        expect(mockedTranslateFn).toHaveBeenCalledWith(
            'padding:',
            { isGridCol: false, isGap: false, isBorder: false, isPadding: true },
            InlineStyleRulesArray,
        );
    });
});
