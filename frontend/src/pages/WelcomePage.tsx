import AllTeasers from '@/componentsTemplateEngine/card';
import Logo from '@/componentsTemplateEngine/mainNav/Logo';
import ToggleAuthMenu from '@/componentsTemplateEngine/mainNav/ToggleAuthMenu';
import type { PageProps, Welcome } from '@/types/templateEngine';

export const WelcomeProps = {
    data: [
        {
            type: 'Teaser',
            id: 1,
            attributes: {
                title: 'Missing Piece',
                description:
                    'Laravel has wonderful documentation covering every aspect of the framework. Whether you are a newcomer or have prior experience with Laravel, we recommend reading our documentation from beginning to end.',
                image: 'https://sokdesign.de/images/about-me.jpg',
                isBigCard: true,
            },
            link: 'https://laravel.com/docs',
        },
        {
            type: 'Teaser',
            id: 2,
            attributes: {
                title: 'Layouts',
                description:
                    'Laracasts offers thousands of video tutorials on Laravel, PHP, and JavaScript development. Check them out, see for yourself, and massively level up your development skills in the process.',
                isBigCard: false,
            },
            link: '/layouts',
        },
        {
            type: 'Teaser',
            id: 3,
            attributes: {
                title: 'E-Commerce',
                description:
                    'Laravel News is a community driven portal and newsletter aggregating all of the latest and most important news in the Laravel ecosystem, including new package releases and tutorials.',
                isBigCard: false,
            },
            link: '/ecommerce',
        },
        {
            type: 'TeaserWithLinks',
            id: 4,
            attributes: {
                title: 'Maps',
                description:
                    "Laravel's robust library of first-party tools andlibraries, such as <a href='/maps' class='rounded-sm underline hover:text-white focus:outline-none'>Maps</a>,  <a href='https://forge.laravel.com' class='rounded-sm underline hover:text-white focus:outline-none'>Forge</a>, <a href='https://vapor.laravel.com' class='rounded-sm underline hover:text-white focus:outline-none'>Vapor</a>,  <a href='https://nova.laravel.com' class='rounded-sm underline hover:text-white focus:outline-none'>Nova</a>, <a href='https://envoyer.io' class='rounded-sm underline hover:text-white focus:outline-none'>Envoyer</a> and <a href='https://herd.laravel.com' class='rounded-sm underline hover:text-white focus:outline-none'>Herd</a> help you take your projects to the next level. Pair them with powerful open source libraries like <a href='https://laravel.com/docs/billing' class='rounded-sm underline hover:text-white focus:outline-none'>Chashier</a>, <a href='https://laravel.com/docs/dusk' class='rounded-sm underline hover:text-white focus:outline-none'>Dusk</a>, <a href='https://laravel.com/docs/broadcasting' class='rounded-sm underline hover:text-white focus:outline-none'>Echo</a>, <a href='https://laravel.com/docs/horizon' class='rounded-sm underline hover:text-white focus:outline-none'>Horizon</a>, <a href='https://laravel.com/docs/sanctum' class='rounded-sm underline hover:text-white focus:outline-none'>Sanctum</a>, <a href='https://telescope.laravel.com' class='rounded-sm underline hover:text-white focus:outline-none'>Telescope</a> and more.",
                isBigCard: false,
            },
        },
    ],
};

const Welcome = ({ auth }: PageProps<Welcome>) => {
    return (
        <>
            <div className="bg-white text-white dark:bg-black dark:text-white/50">
                <img
                    id="background"
                    className="absolute -left-20 top-0 max-w-[600px]"
                    src="https://sokdesign.de/images/bg-welcome.jpg"
                    alt="Background"
                />
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 pt-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center">
                                <Logo logoStyling="text-4xl" sublineStyling="text-3xl" />
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                <ToggleAuthMenu auth={auth} />
                            </nav>
                        </header>
                        <main className="mt-6">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                                <AllTeasers data={WelcomeProps} />
                            </div>
                        </main>
                        <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                            Imprint
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Welcome;
