import { sanitizeInput, sanitizeWithFeedback } from '@/utils/sanitizeInput';
import { describe, expect, it, vi } from 'vitest';

describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
        const input = '<b>hello</b>';
        const sanitized = sanitizeInput(input);
        expect(sanitized).toBe('hello');
    });

    it('should trim whitespace', () => {
        const input = '   hello   ';
        const sanitized = sanitizeInput(input);
        expect(sanitized).toBe('hello');
    });

    it('should remove script tags', () => {
        const input = '<script>alert("x")</script>hi';
        const sanitized = sanitizeInput(input);
        expect(sanitized).toBe('hi');
    });
});

describe('sanitizeWithFeedback', () => {
    it('should sanitize value and set feedback if changed', () => {
        let value = '<b>hello</b>';
        const setValue = (val: string) => {
            value = val;
        };
        let errorMsg = '';
        const setError = (msg: string) => {
            errorMsg = msg;
        };

        const changed = sanitizeWithFeedback({
            value,
            setValue,
            setError,
            friendlyMessage: 'Changed!',
        });

        expect(changed).toBe(true);
        expect(value).toBe('hello');
        expect(errorMsg).toBe('Changed!');
    });

    it('should not set feedback if value unchanged', () => {
        const value = 'hello';
        const setValue = vi.fn();
        const setError = vi.fn();

        const changed = sanitizeWithFeedback({ value, setValue, setError });

        expect(changed).toBe(false);
        expect(setValue).not.toHaveBeenCalled();
        expect(setError).not.toHaveBeenCalled();
    });
});
