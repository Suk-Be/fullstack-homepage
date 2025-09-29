// useAutoFocusOnCondition.ts (or .jsx)
import { RefObject, useEffect, useRef } from 'react';

/**
 * Custom hook to automatically focus an HTML element when a condition becomes true.
 *
 * @param {boolean} condition - The boolean condition that triggers the auto-focus.
 * @param {number} [delay=100] - Optional: Delay in milliseconds before focusing (useful for transitions).
 * @returns {RefObject<T>} A ref to attach to the HTML element you want to focus.
 */
const useInputFocusOnModalOpen = <T extends HTMLElement>(
    condition: boolean,
    delay = 100,
): RefObject<T | null> => {
    const elementRef = useRef<T>(null);

    useEffect(() => {
        if (condition) {
            const timer = setTimeout(() => {
                if (elementRef.current) {
                    elementRef.current.focus();
                }
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [condition, delay]);

    return elementRef;
};

export default useInputFocusOnModalOpen;
