import calculateAndFormatFraction from '@/utils/templateEngine/inlineStylesToTailwindClasses/calculateAndFormatFraction';
import { describe, expect, it } from 'vitest';

describe('calculateAndFormatFraction', () => {
    it('should correctly calculate and format a simple fraction', () => {
        const result = calculateAndFormatFraction('3/2');
        expect(result).toBe('1.5');
    });

    it('should correctly handle whole number results', () => {
        const result = calculateAndFormatFraction('4/2');
        expect(result).toBe('2');
    });

    it('should correctly handle negative numbers', () => {
        const result = calculateAndFormatFraction('-5/2');
        expect(result).toBe('-2.5');
    });

    it('should handle zero in the numerator', () => {
        const result = calculateAndFormatFraction('0/5');
        expect(result).toBe('0');
    });

    // --- Rundungsfälle ---

    it('should round to the default 2 decimal places', () => {
        const result = calculateAndFormatFraction('1/3');
        expect(result).toBe('0.33');
    });

    // --- Fehlerfälle ---

    it('should return an error for division by zero', () => {
        const result = calculateAndFormatFraction('5/0');
        expect(result).toBe('[Error: Division by zero]');
    });

    it("should return an error for invalid fraction format (missing '/')", () => {
        const result = calculateAndFormatFraction('5');
        expect(result).toBe("[Error: Invalid fraction format - missing '/']");
    });

    it("should return an error for invalid fraction format (more than one '/')", () => {
        const result = calculateAndFormatFraction('5/1/2');
        expect(result).toBe('[Error: Invalid fraction format - unexpected number of parts]');
    });

    it('should return an error for non-numeric values in the fraction', () => {
        const result = calculateAndFormatFraction('abc/2');
        expect(result).toBe('[Error: Invalid fraction format - non-numeric values]');
    });

    it('should return an error for non-numeric values in the fraction (second part)', () => {
        const result = calculateAndFormatFraction('2/xyz');
        expect(result).toBe('[Error: Invalid fraction format - non-numeric values]');
    });

    it('should return an error for empty string input', () => {
        const result = calculateAndFormatFraction('');
        expect(result).toBe("[Error: Invalid fraction format - missing '/']");
    });
});
