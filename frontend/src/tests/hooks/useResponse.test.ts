import { useResponse } from '@/hooks/useResponse';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useResponse', () => {
    it('initializes with null success and error', () => {
        const { result } = renderHook(() => useResponse());

        expect(result.current.success.value).toBeNull();
        expect(result.current.error.value).toBeNull();
    });

    it('sets success value', () => {
        const { result } = renderHook(() => useResponse());

        act(() => result.current.success.set('OK'));
        expect(result.current.success.value).toBe('OK');
        expect(result.current.error.value).toBeNull();
    });

    it('sets error value', () => {
        const { result } = renderHook(() => useResponse());

        act(() => result.current.error.set('Oops'));
        expect(result.current.error.value).toBe('Oops');
        expect(result.current.success.value).toBeNull();
    });

    it('clears only success via success.clear()', () => {
        const { result } = renderHook(() => useResponse());

        act(() => {
            result.current.success.set('OK');
            result.current.error.set('Oops');
        });

        act(() => result.current.success.clear());

        expect(result.current.success.value).toBeNull();
        expect(result.current.error.value).toBe('Oops');
    });

    it('clears only error via error.clear()', () => {
        const { result } = renderHook(() => useResponse());

        act(() => {
            result.current.success.set('OK');
            result.current.error.set('Oops');
        });

        act(() => result.current.error.clear());

        expect(result.current.error.value).toBeNull();
        expect(result.current.success.value).toBe('OK');
    });

    it('clears both via clear()', () => {
        const { result } = renderHook(() => useResponse());

        act(() => {
            result.current.success.set('OK');
            result.current.error.set('Oops');
        });

        act(() => result.current.clear());

        expect(result.current.success.value).toBeNull();
        expect(result.current.error.value).toBeNull();
    });
});
