import useScroll from '@/hooks/useScroll';
import { renderHookWithProviders } from '@/tests/utils/testRenderUtils';
import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let currentBodyClasses: Set<string>;
const mockAdd = vi.fn((cls: string) => currentBodyClasses.add(cls));
const mockRemove = vi.fn((cls: string) => currentBodyClasses.delete(cls));
let scrollEventListener: (() => void) | null = null;

const throttleScrollTimeoutMS = 200;
const scrollDown = 100;
const notScrolled = 0;
const scrollUp = scrollDown / 2;
const scrollSoMuchThatItThrottles = 200;

beforeEach(() => {
    currentBodyClasses = new Set<string>();

    vi.spyOn(document.body.classList, 'add').mockImplementation(mockAdd);
    vi.spyOn(document.body.classList, 'remove').mockImplementation(mockRemove);
    vi.spyOn(document.body.classList, 'contains').mockImplementation((cls: string) =>
        currentBodyClasses.has(cls),
    );

    Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        value: 0,
    });

    vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
        if (event === 'scroll') {
            scrollEventListener = handler as () => void;
        }
    });
    vi.spyOn(window, 'removeEventListener').mockImplementation((event, handler) => {
        if (event === 'scroll' && scrollEventListener === handler) {
            scrollEventListener = null;
        }
    });

    vi.useFakeTimers();
});

afterEach(() => {
    mockAdd.mockClear();
    mockRemove.mockClear();
    scrollEventListener = null;
    vi.restoreAllMocks();
    vi.clearAllTimers();
    currentBodyClasses.clear();
});

const simulateScroll = (yOffset: number) => {
    Object.defineProperty(window, 'pageYOffset', { value: yOffset, writable: true });
    if (scrollEventListener) {
        scrollEventListener();
    }
};

describe('useScroll', () => {
    it('should not attach scroll listener if disabled', () => {
        renderHookWithProviders(() => useScroll(false));
        expect(window.addEventListener).not.toHaveBeenCalled();
    });

    it('should add/remove listeners when enabled toggles', () => {
        const { unmount, rerender } = renderHookWithProviders(
            ({ isEnabled }: { isEnabled: boolean }) => useScroll(isEnabled),
            { route: '/', preloadedState: {}, initialProps: { isEnabled: true } },
        );

        expect(window.addEventListener).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function),
            expect.objectContaining({ passive: true }),
        );
        expect(window.addEventListener).toHaveBeenCalledTimes(1);

        rerender({ isEnabled: false });
        expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
        expect(window.removeEventListener).toHaveBeenCalledTimes(1);

        rerender({ isEnabled: true });
        expect(window.addEventListener).toHaveBeenCalledTimes(2);

        unmount();
        expect(window.removeEventListener).toHaveBeenCalledTimes(2);
    });

    it('should remove scroll-up when scrolled to top (<= 0)', () => {
        renderHookWithProviders(() => useScroll(true));

        act(() => simulateScroll(notScrolled));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        expect(mockRemove).toHaveBeenCalledWith('scroll-up');
        expect(mockAdd).not.toHaveBeenCalledWith('scroll-down');
    });

    it('should hide menu on scroll down', () => {
        renderHookWithProviders(() => useScroll(true));

        act(() => simulateScroll(scrollDown));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        expect(mockAdd).toHaveBeenCalledWith('scroll-down');
        expect(mockRemove).toHaveBeenCalledWith('scroll-up');
    });

    it('should show menu on scroll up', () => {
        renderHookWithProviders(() => useScroll(true));

        act(() => simulateScroll(scrollDown + scrollDown));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        expect(mockAdd).toHaveBeenCalledWith('scroll-down');
        expect(mockRemove).toHaveBeenCalledWith('scroll-up');

        mockAdd.mockClear();
        mockRemove.mockClear();

        act(() => simulateScroll(scrollUp));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        expect(mockRemove).toHaveBeenCalledWith('scroll-down');
        expect(mockAdd).toHaveBeenCalledWith('scroll-up');
    });

    it('should throttle scroll events', () => {
        const { unmount } = renderHookWithProviders(() => useScroll(true));

        act(() => simulateScroll(scrollDown));
        expect(mockAdd).toHaveBeenCalledWith('scroll-down');

        mockAdd.mockClear();

        act(() => simulateScroll(scrollSoMuchThatItThrottles));
        // innerhalb der throttle-Zeit → keine weiteren calls
        expect(mockAdd).not.toHaveBeenCalled();

        unmount();
    });

    it('should force menu visible on /template-engine', () => {
        renderHookWithProviders(() => useScroll(true), { route: '/template-engine' });

        expect(mockAdd).toHaveBeenCalledWith('scroll-up');
        expect(mockRemove).toHaveBeenCalledWith('scroll-down')
    });
});
