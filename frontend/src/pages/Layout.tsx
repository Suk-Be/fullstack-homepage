import { ResponsiveContainer } from '@/components/ContainerElements';
import Footer from '@/components/footer';
import MenuNav from '@/components/header';
import { testId } from '@/utils/testId';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router';

const Layout = () => {
    useEffect(() => {
        const banner = document.getElementById('cookie-banner');
        const accepted = localStorage.getItem('cookiesAccepted');
        if (!accepted && banner) {
            banner.style.display = 'block';
        }
    }, []);
    const acceptCookies = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    };
    return (
        <>
            {/* css reset from material ui */}
            <CssBaseline />

            <ResponsiveContainer>
                <MenuNav />
                <div className="main-wrapper">
                    <main {...testId('main')}>
                        {/* container for content pages */}
                        <Outlet />
                        {/* container for toast notifications */}
                        <Toaster position="top-right" />
                    </main>
                    <Footer {...testId('footer')} />
                </div>
            </ResponsiveContainer>
            <aside
                id="cookie-banner"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: '#222',
                    color: '#fff',
                    padding: '1rem',
                    textAlign: 'center',
                    zIndex: 9999,
                    display: 'none',
                }}
            >
                <span>
                    Diese Website verwendet Cookies, um die Funktionalität zu gewährleisten. Darüber
                    hinaus werden keine Daten erfasst. Mehr dazu in unserer{' '}
                    <a href="/datenschutz" style={{ color: '#4fc3f7' }}>
                        Datenschutzerklärung
                    </a>
                    .
                </span>
                <button
                    onClick={acceptCookies}
                    style={{
                        marginLeft: '1rem',
                        background: '#4fc3f7',
                        border: 'none',
                        color: '#000',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                    }}
                >
                    OK
                </button>
            </aside>
        </>
    );
};

export default Layout;
