import './App.css';
import { useAuthInit } from './hooks/auth/useAuthInit';
import Layout from './pages/Layout';

function App() {
    useAuthInit();

    return (
        <>
            <Layout />
        </>
    );
}

export default App;
