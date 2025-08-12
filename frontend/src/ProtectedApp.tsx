import Loading from '@/components/auth/shared-components/Loading';
import NotLoggedInPage from '@/pages/NotLoggedInPage';
import { RootState } from '@/store';
import { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router';

interface ProtectedRouteProps {
    children?: ReactNode;
}

const ProtectedApp: FC<ProtectedRouteProps> = () => {
    const { isLoggedIn, isLoading } = useSelector((state: RootState) => state.login);

    if (isLoading) {
        return <Loading message="Überprüfung der Authentifizierung ..." />;
    }

    return isLoggedIn ? <Outlet /> : <NotLoggedInPage />;
};

export default ProtectedApp;
