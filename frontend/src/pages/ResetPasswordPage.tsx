import { CssBaseline } from '@mui/material';
import ResetPassword from '../components/auth/ResetPassword';
import { ResponsiveContainer } from '../components/ContainerElements';

const ResetPasswordPage = () => {
    return (
        <>
            <CssBaseline />
            <ResponsiveContainer>
                <ResetPassword />
            </ResponsiveContainer>
        </>
    );
};

export default ResetPasswordPage;
