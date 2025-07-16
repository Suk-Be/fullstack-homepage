import { ComponentPropsWithoutRef, FC } from 'react';

const MainNavTextLink: FC<ComponentPropsWithoutRef<'a'>> = ({ href, children }) => {
    return (
        <a
            href={href}
            className="rounded-md px-2 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-green-dark flex items-center"
        >
            {children}
        </a>
    );
};

export default MainNavTextLink;
