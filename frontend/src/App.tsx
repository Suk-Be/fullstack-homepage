import { useEffect } from 'react';
import './App.css';
import requestMe from './components/auth/SignUp/requestMe';
import Layout from './pages/Layout';
import initializeCookies from './plugins/initializeCookies';
import Providers from './providers';
import { getAxiosStatus, logRecoverableError } from './utils/logger';

function App() {
    useEffect(() => {
        const initAuth = async () => {
          try {
                await initializeCookies();
                try {
                    await requestMe(true);
                } catch (error) {
                    console.log('[Auth] No active session found');
                }
            } catch (error) { 
              const axiosStatus = getAxiosStatus(error);
              logRecoverableError({
                context: '[Auth] Failed to initialize cookies:',
                error,
                extra: { axiosStatus },
              })
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
