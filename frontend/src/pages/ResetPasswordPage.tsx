import ResetPassword from '@/components/auth/resetPassword';
import { ResponsiveContainer } from '@/components/ContainerElements';
import { CssBaseline } from '@mui/material';

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
