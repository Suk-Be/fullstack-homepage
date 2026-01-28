import SignIn from '@/components/auth/toggleSignUpSignIn/signIn/index';
import SignUp from '@/components/auth/toggleSignUpSignIn/signUp';
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
