import { useEffect, useState } from 'react';

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

const useScroll = () => {
    let [lastScroll, setScroll] = useState(0);

    useEffect(() => {
        const body = document.body;
        const scrollUp = 'scroll-up';
        const scrollDown = 'scroll-down';

        const handleScroll = () => {
            let currentScroll = window.pageYOffset;
            setScroll(currentScroll);
            if (currentScroll! <= 0) {
                body.classList.remove(scrollUp);
                return;
            }

            if (currentScroll! > lastScroll && !body.classList.contains(scrollDown)) {
                // down
                body.classList.remove(scrollUp);
                body.classList.add(scrollDown);
            } else if (currentScroll! < lastScroll && body.classList.contains(scrollDown)) {
                // up
                body.classList.remove(scrollDown);
                body.classList.add(scrollUp);
            }

            lastScroll = currentScroll;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
};

export default useScroll;
