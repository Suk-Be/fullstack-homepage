import SignIn from '@/components/auth/SignIn/index';
import SignUp from '@/components/auth/SignUp';
import useToggle from '@/hooks/useToggle';

const ToggleSignIn = () => {
    const [showLogin, toggleShowLogin] = useToggle(true);

    return (
        <div>
            {showLogin ? (
                <SignIn onToggleAuth={toggleShowLogin} />
            ) : (
                <SignUp onToggleAuth={toggleShowLogin} />
            )}
        </div>
    );
};

export default ToggleSignIn;
