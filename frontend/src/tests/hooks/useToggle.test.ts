import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useToggle from '../../hooks/useToggle'; // Assuming useToggle is in useToggle.js or useToggle.ts



describe('useToggle', () => {
    const testUtil = () => {
      const { result } = renderHook(() => useToggle());
      const toggle = result.current[1];

      return {
        result,
        toggle
      }
    }

    it('should initialize with false if no parameter is given', () => {
        const { result } = testUtil()
        expect(result.current[0]).toBe(false);
    });

    it('should initialize with true if true is passed', () => {
        const { result } = renderHook(() => useToggle(true));
        expect(result.current[0]).toBe(true);
    });

    it('should toggle between true and false when the toggle function is called', () => {
        const { result, toggle } = testUtil();

        expect(result.current[0]).toBe(false);

        act(() => toggle());

        expect(result.current[0]).toBe(true);

        act(() => toggle());

        expect(result.current[0]).toBe(false);

        act(() => toggle());

        expect(result.current[0]).toBe(true);

        act(() => toggle());

        expect(result.current[0]).toBe(false);
    });
});
