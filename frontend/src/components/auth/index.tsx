import { useState } from 'react';
import SignIn from './SignIn/index';
import SignUp from './SignUp/index';

const ToggleSignIn = () => {
    const [showLogin, setShowLogin] = useState(true);

    const toggle = () => setShowLogin(!showLogin);

    return (
        <div>{showLogin ? <SignIn onToggleAuth={toggle} /> : <SignUp onToggleAuth={toggle} />}</div>
    );
};

export default ToggleSignIn;
