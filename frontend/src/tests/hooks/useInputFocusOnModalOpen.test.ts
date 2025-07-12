import { renderHook } from '@testing-library/react';
import type { Mock } from 'vitest';
import { vi } from 'vitest';
import useInputFocusOnModalOpen from '../../hooks/useInputFocusOnModalOpen';

describe('useInputFocusOnModalOpen', () => {
    let mockFocus: Mock;
    // delay time makes the focus animation run smoothly
    const defaultDelayTime = 100;
    const afterDelayTime = 200;

    beforeEach(() => {
        mockFocus = vi.fn();
        Object.defineProperty(HTMLElement.prototype, 'focus', {
            configurable: true, // Allows us to redefine this property across tests
            value: mockFocus,
        });

        vi.useFakeTimers();
    });
    afterEach(() => {
        mockFocus.mockClear();
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should not set focus on input field if modal is not open', () => {
        renderHook(() => useInputFocusOnModalOpen(false));
        vi.advanceTimersByTime(afterDelayTime);

        expect(mockFocus).not.toHaveBeenCalled();
    });

    it('should set focus on input field with default delayTime if modal is open', () => {
        const { result } = renderHook(() => useInputFocusOnModalOpen(true));

        result.current.current = document.createElement('input');
        vi.advanceTimersByTime(defaultDelayTime);

        expect(mockFocus).toHaveBeenCalled();
    });

    it('should on input field with custom delayTime if modal is open', () => {
        const customDelay = 150;
        const { result } = renderHook(
            ({ condition, delay }) => useInputFocusOnModalOpen(condition, delay),
            {
                initialProps: { condition: true, delay: customDelay }, // Hook starts with condition: false
            },
        );
        result.current.current = document.createElement('input');

        vi.advanceTimersByTime(150);

        expect(mockFocus).toHaveBeenCalled();
    });
});
