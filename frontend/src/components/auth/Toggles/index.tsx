import useToggle from '../../../hooks/useToggle';
import SignIn from '../SignIn/index';
import SignUp from '../SignUp';

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

export default ToggleSignIn