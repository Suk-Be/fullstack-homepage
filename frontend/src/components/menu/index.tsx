import { useEffect, useState } from 'react';
import BasicMenu from './Menu';

const MenuNav = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const changeLoginStatus = () => {
        setIsLoggedIn(!isLoggedIn); // Toggle login status for demonstration
    };

    useEffect(() => {
        const body = document.body;
        const scrollUp = 'scroll-up';
        const scrollDown = 'scroll-down';
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll <= 0) {
                body.classList.remove(scrollUp);
                return;
            }

            if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
                // down
                body.classList.remove(scrollUp);
                body.classList.add(scrollDown);
            } else if (currentScroll < lastScroll && body.classList.contains(scrollDown)) {
                // up
                body.classList.remove(scrollDown);
                body.classList.add(scrollUp);
            }
            lastScroll = currentScroll;
        });
    }, []);

    const Header = () => {
        return (
            <header>
                <nav className="trigger-menu-wrapper">
                    <BasicMenu changeLoginStatus={changeLoginStatus} />
                </nav>
            </header>
        );
    };

    const getHeader = () => {
        if (isLoggedIn) {
            return <Header />;
        }
    };

    return getHeader();
};

export default MenuNav;
