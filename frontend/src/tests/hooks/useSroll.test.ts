import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useScroll from '../../hooks/useScroll'; // Adjust the path as needed

let currentBodyClasses: Set<string>;

const mockAdd = vi.fn((cls: string) => currentBodyClasses.add(cls));
const mockRemove = vi.fn((cls: string) => currentBodyClasses.delete(cls));

// Store the scroll event listener to manually trigger it
let scrollEventListener: (() => void) | null = null;

beforeEach(() => {
    // Initialize currentBodyClasses for each test
    currentBodyClasses = new Set<string>();

    // mock cLassList add and remove behavior
    vi.spyOn(document.body.classList, 'add').mockImplementation(mockAdd);
    vi.spyOn(document.body.classList, 'remove').mockImplementation(mockRemove);
    vi.spyOn(document.body.classList, 'contains').mockImplementation((cls: string) => {
        return currentBodyClasses.has(cls);
    });

    Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        value: 0, // Default to top of the page
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

    // Use fake timers for throttling
    vi.useFakeTimers();
});

afterEach(() => {
    mockAdd.mockClear();
    mockRemove.mockClear();
    scrollEventListener = null;
    vi.restoreAllMocks(); // Restores all spied on methods (classList, window.addEventListener, etc.)
    vi.clearAllTimers();
    currentBodyClasses.clear();
});

const simulateScroll = (yOffset: number) => {
    Object.defineProperty(window, 'pageYOffset', { value: yOffset, writable: true });
    // Manually trigger the scroll event listener
    if (scrollEventListener) {
        scrollEventListener();
    }
};

describe('useScroll', () => {
    it('should not add scroll event listener if it has parameter that is false', () => {
        renderHook(() => useScroll(false));
        expect(window.addEventListener).not.toHaveBeenCalled();
    });

    it('should be capable of adding and removing the scroll event listener (if user isLogggedIn: scroll and if not isLoggedIn do not listen to scroll)', () => {
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
        vi.advanceTimersByTime(200); // Allow initial throttle to pass

        act(() => simulateScroll(100));
        vi.advanceTimersByTime(200); // Allow throttle
        expect(mockAdd).toHaveBeenCalledWith('scroll-down');
        expect(mockRemove).toHaveBeenCalledWith('scroll-up'); // From initial state to scroll-down

        mockAdd.mockClear();
        mockRemove.mockClear();

        // Simulate scrolling to top
        act(() => simulateScroll(0));
        vi.advanceTimersByTime(200); // Allow throttle

        expect(mockRemove).toHaveBeenCalledWith('scroll-up');
        expect(mockAdd).not.toHaveBeenCalledWith('scroll-down');
    });

    it('should remove the main menu, add scroll-down and remove scroll-up class when scrolling down', () => {
        renderHook(() => useScroll(true));
        vi.advanceTimersByTime(200); // Allow initial throttle to pass

        // Simulate initial scroll down
        act(() => simulateScroll(100)); // lastScroll.current becomes 100
        vi.advanceTimersByTime(200); // Allow throttle

        expect(mockAdd).toHaveBeenCalledWith('scroll-down');
        expect(mockRemove).toHaveBeenCalledWith('scroll-up'); // If present, it will remove it.

        // Clear mocks to test subsequent calls
        mockAdd.mockClear();
        mockRemove.mockClear();

        // --- Second scroll down: Should do nothing if 'scroll-down' is already present ---
        act(() => simulateScroll(200)); // Scroll further down (e.g., from 100 to 200)
        vi.advanceTimersByTime(200); // Allow throttle

        expect(mockAdd).not.toHaveBeenCalled();
        expect(mockRemove).not.toHaveBeenCalled();
    });

    it('should show the main menu, add scroll-up class when scrolling up', () => {
        renderHook(() => useScroll(true));
        vi.advanceTimersByTime(200);

        act(() => simulateScroll(200));
        vi.advanceTimersByTime(200);
        expect(mockAdd).toHaveBeenCalledWith('scroll-down');
        expect(mockRemove).toHaveBeenCalledWith('scroll-up');

        mockAdd.mockClear();
        mockRemove.mockClear();

        act(() => simulateScroll(100));
        vi.advanceTimersByTime(200);

        expect(mockRemove).toHaveBeenCalledWith('scroll-down');
        expect(mockAdd).toHaveBeenCalledWith('scroll-up');
        expect(mockAdd).toHaveBeenCalledTimes(1);
        expect(mockRemove).toHaveBeenCalledTimes(1);

        mockAdd.mockClear();
        mockRemove.mockClear();

        act(() => simulateScroll(50));
        vi.advanceTimersByTime(200);

        expect(mockAdd).not.toHaveBeenCalled();
        expect(mockRemove).not.toHaveBeenCalled();
    });

    it('should handle throttling correctly', () => {
        const { unmount } = renderHook(() => useScroll(true));

        // 1. Initial scroll DOWN: Should add 'scroll-down'
        act(() => {
            simulateScroll(100);
        });
        expect(mockAdd).toHaveBeenCalledWith('scroll-down');
        expect(mockAdd).toHaveBeenCalledTimes(1); // First time mockAdd is called
        mockAdd.mockClear(); // Clear for subsequent assertions

        // 2. Advance timers past the throttle limit
        vi.advanceTimersByTime(200);

        // 3. Scroll UP: This should remove 'scroll-down' and add 'scroll-up'
        act(() => {
            simulateScroll(50); // Scroll up from 100 to 50
        });
        expect(mockRemove).toHaveBeenCalledWith('scroll-down');
        expect(mockAdd).toHaveBeenCalledWith('scroll-up');
        expect(mockAdd).toHaveBeenCalledTimes(1);
        mockAdd.mockClear();
        mockRemove.mockClear();

        // 4. Advance timers past the throttle limit again
        vi.advanceTimersByTime(200);

        // 5. Scroll DOWN again: This should remove 'scroll-up' and add 'scroll-down'
        act(() => {
            simulateScroll(150);
        });
        expect(mockRemove).toHaveBeenCalledWith('scroll-up');
        expect(mockAdd).toHaveBeenCalledWith('scroll-down');
        expect(mockAdd).toHaveBeenCalledTimes(1);
        mockAdd.mockClear();
        mockRemove.mockClear();

        // Test that further calls within throttle are ignored
        act(() => {
            simulateScroll(200); // Scroll further down, but 'scroll-down' is already present
        });
        expect(mockAdd).not.toHaveBeenCalled(); // No new calls
        expect(mockRemove).not.toHaveBeenCalled(); // No new calls

        unmount();
    });

    it('should reset lastScroll.current correctly', () => {
        renderHook(() => useScroll(true));
        vi.advanceTimersByTime(200);

        act(() => simulateScroll(100));
        vi.advanceTimersByTime(200);

        act(() => simulateScroll(50));
        vi.advanceTimersByTime(200);

        expect(mockRemove).toHaveBeenCalledWith('scroll-down');
        expect(mockAdd).toHaveBeenCalledWith('scroll-up');
    });
});
