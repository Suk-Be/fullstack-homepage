import useScroll from '@/hooks/useScroll';
import { RootState } from '@/store/';
import { testId } from '@/utils/testId';
import { useSelector } from 'react-redux';
import LoggedInMenu from './LoggedInMenu';
import LoggedOutMenu from './LoggedOutMenu';

const MenuNav = () => {
    const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
    // is needed to make menu visible on scroll
    useScroll(isLoggedIn);

    const Header = () => {
        return (
            <header {...testId('header-main-menu')}>
                <nav className="trigger-menu-wrapper">
                    {isLoggedIn ? <LoggedInMenu /> : <LoggedOutMenu />}
                </nav>
            </header>
        );
    };

    return <Header />;
};

export default MenuNav;
