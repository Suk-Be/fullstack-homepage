import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router';
import MenuNav from '../components/menu';
// import MenuAppBar from '../components/MenuAppBar';

const Layout = () => {
    return (
        <>
            {/* css reset from material ui */}
            <CssBaseline />

            {/* <MenuAppBar /> */}

            <MenuNav />
            <main className="main-wrapper">
                <Outlet />
                <Toaster />
            </main>
        </>
    );
};

export default Layout;
