import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router';
import { ResponsiveContainer } from '../components/ContainerElements';
import Footer from '../components/footer';
import MenuNav from '../components/header';

const Layout = () => {
    return (
        <>
            {/* css reset from material ui */}
            <CssBaseline />

            <ResponsiveContainer>
                <MenuNav />
                <main className="main-wrapper">
                    <Outlet />
                    <Toaster />
                </main>
                <Footer />
            </ResponsiveContainer>
        </>
    );
};

export default Layout;
