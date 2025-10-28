import DOMPurify from 'dompurify';

export const sanitizeInput = (value: string): string => {
    // DOMPurify entfernt HTML, JS, Eventhandler etc.
    // und trimmt direkt
    return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
};

interface SanitizeOptions {
    value: string;
    setValue: (val: string) => void;
    setError?: (msg: string) => void;
    friendlyMessage?: string;
}

/**
 * Sanitizes an input string and optionally notifies the user if the value was modified.
 *
 * @param options.value - The raw input value
 * @param options.setValue - State setter for the input value
 * @param options.setError - Optional state setter for error or info message
 * @param options.friendlyMessage - Optional message to show when sanitization occurs
 * @returns boolean - true if the value changed during sanitization
 */
export function sanitizeWithFeedback({
    value,
    setValue,
    setError,
    friendlyMessage = 'Some special characters were automatically removed. If this is okay with you, please confirm.',
}: SanitizeOptions): boolean {
    const sanitized = sanitizeInput(value);

    if (sanitized !== value) {
        setValue(sanitized);
        if (setError) {
            setError(friendlyMessage);
        }
        return true; // indicates a change happened
    }

    return false;
}
