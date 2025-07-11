import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useToggle from '../../hooks/useToggle'; // Assuming useToggle is in useToggle.js or useToggle.ts

describe('useToggle', () => {
    it('should initialize with false if no parameter is given', () => {
        const { result } = renderHook(() => useToggle());
        expect(result.current[0]).toBe(false);
    });

    it('should initialize with true if true is passed', () => {
        const { result } = renderHook(() => useToggle(true));
        expect(result.current[0]).toBe(true);
    });

    it('should toggle between true and false when the toggle function is called', () => {
        const { result } = renderHook(() => useToggle());

        // Initial state
        expect(result.current[0]).toBe(false);

        // Toggle to true
        act(() => {
            result.current[1]();
        });

        expect(result.current[0]).toBe(true);

        // Toggle back to false
        act(() => {
            result.current[1]();
        });
        expect(result.current[0]).toBe(false);

        act(() => {
            result.current[1](); // Toggles to true
        });
        expect(result.current[0]).toBe(true);

        act(() => {
            result.current[1](); // Toggles to false
        });
        expect(result.current[0]).toBe(false);
    });
});
