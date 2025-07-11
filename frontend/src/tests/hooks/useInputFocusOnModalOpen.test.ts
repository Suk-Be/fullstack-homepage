import { act, renderHook } from '@testing-library/react';
import type { Mock } from 'vitest';
import { vi } from 'vitest';
import useInputFocusOnModalOpen from '../../hooks/useInputFocusOnModalOpen';

describe('useInputFocusOnModalOpen', () => {
    let mockFocus: Mock;
    beforeEach(() => {
        // Create a mock function for HTMLElement.prototype.focus
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

    // Test Case 1: Should not focus if the condition is initially false
    it('should not set focus on input field if modal is not open', () => {
        renderHook(() => useInputFocusOnModalOpen(false));
        vi.advanceTimersByTime(200);

        expect(mockFocus).not.toHaveBeenCalled();
    });

    // Test Case 2: Should focus when the condition becomes true after the default delay
    it('should set focus on input field if modal is open', () => {
        const { result } = renderHook(() => useInputFocusOnModalOpen(true));

        result.current.current = document.createElement('input');
        vi.advanceTimersByTime(100);

        expect(mockFocus).toHaveBeenCalled();
    });

    // Test Case 3: Should focus when the condition becomes true after a custom delay (default custom delay is set to 100ms for better animation)
    it('should focus with a custom delay time', () => {
        const customDelay = 150;
        const { result, rerender } = renderHook(
            ({ condition, delay }) => useInputFocusOnModalOpen(condition, delay),
            {
                initialProps: { condition: false, delay: customDelay }, // Hook starts with condition: false
            },
        );
        result.current.current = document.createElement('input');

        expect(mockFocus).not.toHaveBeenCalled();

        // Change condition to true to enable input focus
        act(() => {
            rerender({ condition: true, delay: customDelay });
        });
        vi.advanceTimersByTime(150);

        expect(mockFocus).toHaveBeenCalled();
    });

    // Test Case 4: Should not focus if the condition becomes false before the delay elapses
    it('should not focus if condition becomes false before delay elapses', () => {
        const { result, rerender } = renderHook(() => useInputFocusOnModalOpen(false));
        result.current.current = document.createElement('input');

        expect(result.current.current).not.toBeNull();
        expect(mockFocus).not.toHaveBeenCalled();

        // enable input focus, starting the timeout
        act(() => {
            rerender({ condition: true });
        });

        // Advance some time, but not enough for the focus to trigger
        vi.advanceTimersByTime(50);
        expect(mockFocus).not.toHaveBeenCalled();

        // disable input focus (close modal), which should clear the pending timeout
        act(() => {
            rerender({ condition: false });
        });

        // check if reset timeout worked, add another 50ms to the 50ms
        vi.advanceTimersByTime(50);
        expect(mockFocus).not.toHaveBeenCalled();
    });

    // Test Case 5: Should not focus if the hook unmounts before the delay elapses
    it('should not focus if component unmounts before delay elapses', () => {
        const { result, rerender, unmount } = renderHook(() => useInputFocusOnModalOpen(false));
        result.current.current = document.createElement('input');

        expect(result.current.current).not.toBeNull();
        expect(mockFocus).not.toHaveBeenCalled();

        // Condition becomes true, starting the timeout
        act(() => {
            rerender({ condition: true });
        });

        // Advance some time, but not enough for the focus to trigger
        vi.advanceTimersByTime(50);
        expect(mockFocus).not.toHaveBeenCalled();

        // Unmount the hook, which should trigger the useEffect cleanup function to clear the timeout
        unmount();

        // Advance the remaining time
        vi.advanceTimersByTime(50); // Total 100ms advanced
        expect(mockFocus).not.toHaveBeenCalled();
    });

    // Test Case 6: Should handle elementRef.current becoming null gracefully
    it('should not throw an error if the elementRef.current becomes null before focus attempt', () => {
        const { result, rerender } = renderHook(() => useInputFocusOnModalOpen(false));

        act(() => {
            result.current.current = null;
            rerender({ condition: true }); // Trigger the focus logic
        });

        // Advance time past the default delay
        vi.advanceTimersByTime(100);

        expect(mockFocus).not.toHaveBeenCalled();
    });
});
