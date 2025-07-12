import { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router';
import { Navigate } from 'react-router-dom';
import { RootState } from './store';

interface ProtectedRouteProps {
    children?: ReactNode;
}

const ProtectedApp: FC<ProtectedRouteProps> = () => {
    const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedApp;
