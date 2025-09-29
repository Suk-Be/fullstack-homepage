import separateStyleRulesArray from '@/utils/templateEngine/inlineStylesToTailwindClasses/SeparateStyleRulesArray';
import { describe, expect, it } from 'vitest';

describe('separateStyleRulesArray', () => {
    it('should correctly separate style rules from a valid attribute string', () => {
        // Ein StyleAttributes-Array, wie es von der RegExp-Suche kommen würde
        const styleAttributes = [
            'style="display: grid; gap: 1rem; padding: 2rem;"',
        ] as RegExpMatchArray;

        const result = separateStyleRulesArray(styleAttributes);

        expect(result).toEqual(['display: grid', 'gap: 1rem', 'padding: 2rem']);
    });

    it('should return null if the input is null', () => {
        const result = separateStyleRulesArray(null);

        expect(result).toBe(null);
    });

    it('should handle a single style rule correctly', () => {
        const styleAttributes = ['style="display: grid;"'] as RegExpMatchArray;

        const result = separateStyleRulesArray(styleAttributes);

        expect(result).toEqual(['display: grid']);
    });

    it('should handle trailing semicolons gracefully', () => {
        const styleAttributes = ['style="color: red; font-size: 16px;"'] as RegExpMatchArray;

        const result = separateStyleRulesArray(styleAttributes);

        expect(result).toEqual(['color: red', 'font-size: 16px']);
    });

    it('should handle an empty style string within the attribute', () => {
        const styleAttributes = ['style=""'] as RegExpMatchArray;

        const result = separateStyleRulesArray(styleAttributes);
        // Die `cleanupRegExpMatchArray`-Funktion entfernt leere Einträge,
        expect(result).toEqual([]);
    });

    it('should handle multiple spaces and odd formatting', () => {
        const styleAttributes = ['style="  display: grid  ;  gap: 1rem  ;"'] as RegExpMatchArray;

        const result = separateStyleRulesArray(styleAttributes);

        expect(result).toEqual(['display: grid', 'gap: 1rem']);
    });
});
