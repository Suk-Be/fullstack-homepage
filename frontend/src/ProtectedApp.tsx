import Loading from '@/components/auth/auth-shared-components/Loading';
import NotLoggedInPage from '@/pages/NotLoggedInPage';
import { useAppSelector } from '@/store/hooks';
import { selectLoginState } from '@/store/selectors/loginSelectors';
import { FC, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    children?: ReactNode;
}

const ProtectedApp: FC<ProtectedRouteProps> = () => {
    const { isLoggedIn, isLoading } = useAppSelector(selectLoginState);

    if (isLoading) {
        return <Loading message="Überprüfung der Authentifizierung ..." />;
    }

    return isLoggedIn ? <Outlet /> : <NotLoggedInPage />;
};

export default ProtectedApp;
