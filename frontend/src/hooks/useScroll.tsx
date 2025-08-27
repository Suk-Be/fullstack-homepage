import { useEffect, useRef  } from 'react';

/**
 * Hook to make the header appear and disappear
 * @html
 * header tag - header component used in LayoutPage for every page
 * @css classes needed for hook behavior
 * in App.css
 * .trigger-menu-wrapper
 * .scroll-down .trigger-menu-wrapper
 * .scroll-up .trigger-menu-wrapper
 * .scroll-up:not(.menu-open) .trigger-menu-wrapper
 */

const throttle = (func: () => void, limit: number) => {
    let inThrottle: boolean;
    return () => {
        if (!inThrottle) {
            func();
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

const useScroll = (isEnabled: boolean) => {
    const lastScroll = useRef(0);

    useEffect(() => {
        if (!isEnabled) return;

        const body = document.body;
        const scrollUp = 'scroll-up';
        const scrollDown = 'scroll-down';

        const handleScroll = () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll <= 0) {
                body.classList.remove(scrollUp);
                return;
            }

            if (currentScroll > lastScroll.current && !body.classList.contains(scrollDown)) {
                body.classList.remove(scrollUp);
                body.classList.add(scrollDown);
            } else if (currentScroll < lastScroll.current && body.classList.contains(scrollDown)) {
                body.classList.remove(scrollDown);
                body.classList.add(scrollUp);
            }

            lastScroll.current = currentScroll;
        };

        const throttledScroll = throttle(handleScroll, 200);

        window.addEventListener('scroll', throttledScroll);

        return () => {
            window.removeEventListener('scroll', throttledScroll);
        };
    }, [isEnabled]);
};

export default useScroll;
