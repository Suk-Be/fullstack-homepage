import LoggedInMenu from '@/components/header/LoggedInMenu';
import LoggedOutMenu from '@/components/header/LoggedOutMenu';
import useScroll from '@/hooks/useScroll';
import { useAppSelector } from '@/store/hooks';
import { selectIsLoggedIn } from '@/store/selectors/loginSelectors';
import { testId } from '@/utils/testId';

const MenuNav = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
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
