import { useSelector } from 'react-redux';
import useScroll from '../../hooks/useScroll';
import { RootState } from '../../store';
import { testId } from '../../utils/testId';
import BasicMenu from './Menu';

const MenuNav = () => {
    const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
    // is needed to make menu visible on scroll
    useScroll(isLoggedIn);

    const Header = () => {
        return (
            <header {...testId('header-main-menu')}>
                <nav className="trigger-menu-wrapper">
                    <BasicMenu />
                </nav>
            </header>
        );
    };

    return isLoggedIn ? <Header /> : null;
};

export default MenuNav;
