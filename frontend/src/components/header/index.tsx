import { useState } from 'react';
import useScroll from '../../hooks/useScroll';
import BasicMenu from './Menu';

const MenuNav = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const changeLoginStatus = () => {
        setIsLoggedIn(!isLoggedIn); // Toggle login status for demonstration
    };

    useScroll();

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
