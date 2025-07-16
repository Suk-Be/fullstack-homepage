import Logo from '../../componentsTemplateEngine/mainNav/Logo';
import MainNavTextLink from '../../componentsTemplateEngine/mainNav/MainNavTextLink';
import ToggleAuthMenu from '../../componentsTemplateEngine/mainNav/ToggleAuthMenu';
import { HomeSmallSVG } from '../svgs';
import { PageProps } from '../../types/templateEngine';

const MainNav = ({ auth }: PageProps) => {
    return (
        <header className="relative z-0">
            <div className="absolute w-full">
                <div className="flex flex-wrap items-center md:max-w-screen-md mx-auto py-6">
                    <div className="flex flex-1 justify-between">
                        <a href="/" aria-label="logo-banner" className="flex flex-col items-center">
                            <Logo
                                logoStyling="text-2xl lg:text-4xl"
                                sublineStyling="text-[1.3rem] lg:text-3xl"
                            />
                        </a>
                        <nav className="flex items-center" aria-label="main">
                            <MainNavTextLink href="/">
                                <HomeSmallSVG className="mr-2" />
                                <span>Home</span>
                            </MainNavTextLink>
                            |<MainNavTextLink href="/layouts">Layouts</MainNavTextLink>|
                            <MainNavTextLink href="/ecommerce">ECommerce</MainNavTextLink>|
                            <MainNavTextLink href="/maps">Maps</MainNavTextLink>
                        </nav>
                        <nav className="flex items-center" data-testid='toggle-auth-menu'>
                            <ToggleAuthMenu auth={auth} />
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default MainNav;
