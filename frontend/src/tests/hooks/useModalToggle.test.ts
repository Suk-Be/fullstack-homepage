import useModalToggle from '@/hooks/useModalToggle';
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

describe('useModalToggle', () => {
    const renderUtil = () => {
        const { result, rerender } = renderHook(() => useModalToggle());
        const windowOpen = result.current.open;
        const handleClickOpen = result.current.handleClickOpen;
        const handleClose = result.current.handleClose;
        return {
            result,
            rerender,
            windowOpen,
            handleClickOpen,
            handleClose,
        };
    };

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should be initial a closed modal', () => {
        const { windowOpen } = renderUtil();

        expect(windowOpen).toBe(false);
    });

    it('should open modal when open handler is click', () => {
        const { result, handleClickOpen } = renderUtil();

        act(() => handleClickOpen());

        expect(result.current.open).toBe(true);
    });

    it('should open and close modal (toggle) when handlers are clicked', () => {
        const { result, handleClickOpen, handleClose } = renderUtil();

        act(() => handleClickOpen());

        expect(result.current.open).toBe(true);

        act(() => handleClose());

        expect(result.current.open).toBe(false);
    });

    it('should memoize handleClickOpen and handleClose functions', () => {
        const { result, rerender, handleClickOpen } = renderUtil();

        const initialHandleClickOpen = result.current.handleClickOpen;
        const initialHandleClose = result.current.handleClose;
        rerender();

        expect(result.current.handleClickOpen).toBe(initialHandleClickOpen);
        expect(result.current.handleClose).toBe(initialHandleClose);

        act(() => handleClickOpen());
        rerender();

        expect(result.current.handleClickOpen).toBe(initialHandleClickOpen);
        expect(result.current.handleClose).toBe(initialHandleClose);
    });
});
