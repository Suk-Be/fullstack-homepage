// AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LaravelApiClient from '../../../plugins/axios';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        LaravelApiClient.get('/me')
            .then((res) => {
                console.log('Logged in user:', res.data);
                navigate('/');
            })
            .catch((err) => {
                console.log('Not logged in:', err);
                navigate('/');
            });
    }, []);

    return <p>Logging in...</p>;
};

export default AuthCallback;
