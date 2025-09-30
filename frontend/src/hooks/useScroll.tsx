import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const URL_SEGMENT_TO_CHECK = '/template-engine';

const throttle = (func: () => void, limit: number) => {
    let inThrottle = false;
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
    const { pathname: rawPath } = useLocation();
    const pathname = rawPath.replace(/\/$/, ''); // normalize trailing slash

    useEffect(() => {
        if (!isEnabled) return;

        const body = document.body;
        const scrollUp = 'scroll-up';
        const scrollDown = 'scroll-down';

        const isTemplateEnginePage = pathname === URL_SEGMENT_TO_CHECK;

        const handleScroll = () => {
            if (window.location.pathname.replace(/\/$/, '') === URL_SEGMENT_TO_CHECK) {
                body.classList.remove(scrollDown);
                if (!body.classList.contains(scrollUp)) body.classList.add(scrollUp);
                return;
            }

            const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;

            if (currentScroll <= 0) {
                body.classList.remove(scrollUp);
                lastScroll.current = 0;
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

        const throttled = throttle(handleScroll, 200);

        // Initialisieren: setze lastScroll auf aktuellen Scroll, damit sofortige Navigations-„Sprünge“
        // nicht als Scroll-Richtung interpretiert werden
        lastScroll.current = window.pageYOffset || 0;

        // Wenn wir auf der Template-Engine-Root sind, erzwinge scroll-up sofort.
        if (isTemplateEnginePage) {
            body.classList.remove(scrollDown);
            if (!body.classList.contains(scrollUp)) body.classList.add(scrollUp);
        } else {
            // sonst initial Handler laufen lassen, damit Klassen beim Seitenwechsel korrekt sind
            handleScroll();
        }

        window.addEventListener('scroll', throttled, { passive: true });

        return () => {
            window.removeEventListener('scroll', throttled);
            // wir *entfernen hier nicht* die Klassen, damit der nächste Effekt (bei Navigation)
            // die Klassen sauber setzen kann; alternativ könntest du hier cleanup machen, wenn gewünscht.
        };
    }, [isEnabled, pathname]);
};

export default useScroll;
