import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import requestMe from './components/auth/SignUp/requestMe';
import Layout from './pages/Layout';
import initializeCookies from './plugins/initializeCookies';
import type { AppDispatch } from './store';
import { login } from './store/loginSlice';
import { getAxiosStatus, logRecoverableError } from './utils/logger';

function App() {
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        const initAuth = async () => {
            try {
                await initializeCookies();
                try {
                    const result = await requestMe(true);
                    if (result && result.success) {
                        dispatch(login());
                    }
                } catch (error) {
                    console.log('[Auth] No active session found');
                }
            } catch (error) {
                const axiosStatus = getAxiosStatus(error);
                logRecoverableError({
                    context: '[Auth] Failed to initialize cookies:',
                    error,
                    extra: { axiosStatus },
                });
            }
        };

        initAuth();
    }, []);

    return (
        <>
            <Layout />
        </>
    );
}

export default App;
