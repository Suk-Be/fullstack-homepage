import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useScroll from '../../hooks/useScroll'; // Adjust the path as needed

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
    vi.spyOn(document.body.classList, 'contains').mockImplementation((cls: string) => {
        return currentBodyClasses.has(cls);
    });

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
    it('should only listen to scroll positions if enabled (better performance)', () => {
        renderHook(() => useScroll(false));
        expect(window.addEventListener).not.toHaveBeenCalled();
    });

    it('should be be be calleable with enabled and not enabled (isEnabled boolean)', () => {
        const { unmount, rerender } = renderHook(({ isEnabled }) => useScroll(isEnabled), {
            initialProps: { isEnabled: true },
        });

        expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
        expect(window.addEventListener).toHaveBeenCalledTimes(1);

        rerender({ isEnabled: false });
        expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
        expect(window.removeEventListener).toHaveBeenCalledTimes(1);

        rerender({ isEnabled: true });
        expect(window.addEventListener).toHaveBeenCalledTimes(2);

        unmount();
        expect(window.removeEventListener).toHaveBeenCalledTimes(2);
    });

    it('should remove scroll-up class when scrolled to top (<= 0).', () => {
        renderHook(() => useScroll(true));
        
        act(() => simulateScroll(notScrolled));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        expect(mockRemove).toHaveBeenCalledWith('scroll-up');
        expect(mockAdd).not.toHaveBeenCalledWith('scroll-down');
    });

    it('should not show the main menu, when scrolling down.', () => {
        renderHook(() => useScroll(true));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        // --- First scroll down
        act(() => simulateScroll(scrollDown));
        vi.advanceTimersByTime(throttleScrollTimeoutMS); 

        expect(mockAdd).toHaveBeenCalledWith('scroll-down');
        expect(mockRemove).toHaveBeenCalledWith('scroll-up');

        // reset to test subsequent calls
        mockAdd.mockClear();
        mockRemove.mockClear();

        // --- Second scroll further down
        act(() => simulateScroll(scrollDown + scrollDown));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        expect(mockAdd).not.toHaveBeenCalled();
        expect(mockRemove).not.toHaveBeenCalled();
    });

    it('should show the main menu, add scroll-up class when scrolling up', () => {
        renderHook(() => useScroll(true));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        act(() => simulateScroll(scrollDown + scrollDown));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        expect(mockAdd).toHaveBeenCalledWith('scroll-down');
        expect(mockRemove).toHaveBeenCalledWith('scroll-up');

        mockAdd.mockClear();
        mockRemove.mockClear();

        act(() => simulateScroll(scrollDown));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        expect(mockRemove).toHaveBeenCalledWith('scroll-down');
        expect(mockAdd).toHaveBeenCalledWith('scroll-up');
        expect(mockAdd).toHaveBeenCalledTimes(1);
        expect(mockRemove).toHaveBeenCalledTimes(1);

        mockAdd.mockClear();
        mockRemove.mockClear();

        act(() => simulateScroll(50));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        expect(mockAdd).not.toHaveBeenCalled();
        expect(mockRemove).not.toHaveBeenCalled();
    });

    it('should handle throttling correctly', () => {
        const { unmount } = renderHook(() => useScroll(true));

        act(() => {
            simulateScroll(scrollDown);
        });
        expect(mockAdd).toHaveBeenCalledWith('scroll-down');
        expect(mockAdd).toHaveBeenCalledTimes(1);

        mockAdd.mockClear(); 

        vi.advanceTimersByTime(throttleScrollTimeoutMS);
        act(() => {
            simulateScroll(scrollUp); // Scroll up from 100 to 50
        });

        expect(mockRemove).toHaveBeenCalledWith('scroll-down');
        expect(mockAdd).toHaveBeenCalledWith('scroll-up');
        expect(mockAdd).toHaveBeenCalledTimes(1);
        
        mockAdd.mockClear();
        mockRemove.mockClear();

        vi.advanceTimersByTime(throttleScrollTimeoutMS);
        act(() => {
            simulateScroll(scrollDown * 1.5);
        });

        expect(mockRemove).toHaveBeenCalledWith('scroll-up');
        expect(mockAdd).toHaveBeenCalledWith('scroll-down');
        expect(mockAdd).toHaveBeenCalledTimes(1);
        
        mockAdd.mockClear();
        mockRemove.mockClear();

        // Test that further calls within throttle are ignored
        act(() => {
            simulateScroll(scrollSoMuchThatItThrottles); 
        });
        expect(mockAdd).not.toHaveBeenCalled(); // No new calls
        expect(mockRemove).not.toHaveBeenCalled(); // No new calls

        unmount();
    });

    it('should reset lastScroll.current correctly', () => {
        renderHook(() => useScroll(true));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        act(() => simulateScroll(scrollDown));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        act(() => simulateScroll(scrollUp));
        vi.advanceTimersByTime(throttleScrollTimeoutMS);

        expect(mockRemove).toHaveBeenCalledWith('scroll-down');
        expect(mockAdd).toHaveBeenCalledWith('scroll-up');
    });
});
