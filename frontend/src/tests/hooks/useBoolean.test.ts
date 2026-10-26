import { useBoolean } from '@/hooks/useBoolean';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useBoolean', () => {
    it('initializes with false by default', () => {
        const { result } = renderHook(() => useBoolean());
        expect(result.current.value).toBe(false);
    });

    it('initializes with true if passed', () => {
        const { result } = renderHook(() => useBoolean(true));
        expect(result.current.value).toBe(true);
    });

    it('toggles value', () => {
        const { result } = renderHook(() => useBoolean());

        expect(result.current.value).toBe(false);

        act(() => result.current.toggle());
        expect(result.current.value).toBe(true);

        act(() => result.current.toggle());
        expect(result.current.value).toBe(false);
    });

    it('setTrue sets value to true', () => {
        const { result } = renderHook(() => useBoolean());

        act(() => result.current.setTrue());
        expect(result.current.value).toBe(true);
    });

    it('setFalse sets value to false', () => {
        const { result } = renderHook(() => useBoolean(true));

        act(() => result.current.setFalse());
        expect(result.current.value).toBe(false);
    });

    it('onChange updates value from event.checked', () => {
        const { result } = renderHook(() => useBoolean());

        act(() => {
            result.current.onChange({
                target: { checked: true },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.value).toBe(true);
    });
});
