import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import useModalToggle from '../../hooks/useModalToggle';

describe('useModalToggle', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    // Test Case 1: Initial state should be false
    it('should be initialized with the open state to false', () => {
        const { result } = renderHook(() => useModalToggle());

        expect(result.current.open).toBe(false);
    });

    // Test Case 2: handleClickOpen should set open to true
    it('should set open state to true when handleClickOpen is called', () => {
        const { result } = renderHook(() => useModalToggle());

        act(() => {
            result.current.handleClickOpen();
        });

        expect(result.current.open).toBe(true);
    });

    // Test Case 3: handleClose should set open to false
    it('should set open to false when handleClose is called', () => {
        const { result } = renderHook(() => useModalToggle());

        // Set to true
        act(() => {
            result.current.handleClickOpen();
        });

        expect(result.current.open).toBe(true);

        // call handleClose
        act(() => {
            result.current.handleClose();
        });

        expect(result.current.open).toBe(false);
    });

    // Test Case 4: handleClickOpen and handleClose should maintain referential equality
    it('should memoize handleClickOpen and handleClose functions', () => {
        const { result, rerender } = renderHook(() => useModalToggle());

        // Store initial references
        const initialHandleClickOpen = result.current.handleClickOpen;
        const initialHandleClose = result.current.handleClose;

        // Rerender the hook
        rerender();

        expect(result.current.handleClickOpen).toBe(initialHandleClickOpen);
        expect(result.current.handleClose).toBe(initialHandleClose);

        // Call one of the functions to change state, then rerender
        act(() => {
            result.current.handleClickOpen();
        });
        rerender();

        // Assert memoization
        expect(result.current.handleClickOpen).toBe(initialHandleClickOpen);
        expect(result.current.handleClose).toBe(initialHandleClose);
    });
});
