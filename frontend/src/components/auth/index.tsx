import { useSelector } from 'react-redux';
import useToggle from '../../hooks/useToggle';
import { RootState } from '../../store';
import AccordionExpandIcon from './AccordionTeaser';
import SignIn from './SignIn/index';
import SignUp from './SignUp';

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

const ToggleTeaser = () => {
    const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

    return isLoggedIn ? <AccordionExpandIcon /> : <ToggleSignIn />;
};

export default ToggleTeaser;
