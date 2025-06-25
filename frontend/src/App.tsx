import { useEffect } from 'react';
import './App.css';
import Layout from './pages/Layout';
import initializeCookie from './plugins/fetchCsrfCookie';
import Providers from './providers';

function App() {
    useEffect(() => {
        initializeCookie();
    }, []);

    return (
        <Providers>
            <Layout />
        </Providers>
    );
}

export default App;
