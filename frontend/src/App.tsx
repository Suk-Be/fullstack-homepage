import { useEffect } from 'react';
import './App.css';
import requestMe from './components/auth/SignUp/requestMe';
import Layout from './pages/Layout';
import initializeCookies from './plugins/initializeCookies';
import Providers from './providers';

function App() {
    useEffect(() => {
        const initAuth = async () => {
            await initializeCookies();

            try {
                await requestMe(true); // or LaravelApiClient.get('/api/user')
            } catch (error) {
                console.log('[Auth] No active session found');
            }
        };

        initAuth();
    }, []);

    return (
        <Providers>
            <Layout />
        </Providers>
    );
}

export default App;
