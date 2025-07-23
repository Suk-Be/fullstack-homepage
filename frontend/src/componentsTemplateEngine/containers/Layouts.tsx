import MainNav from '../mainNav';
import { PageProps } from '../../types/templateEngine';
import { ReactNode } from 'react';

const Layout = ({ auth, children }: PageProps & { children: ReactNode }) => {
    return (
        <div className="flex flex-col w-full">
            <MainNav auth={auth} />
            {children}
        </div>
    );
};

export default Layout;
