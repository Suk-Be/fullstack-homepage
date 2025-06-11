import { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

const ToggleSignIn = () => {
    const [showLogin, setShowLogin] = useState(false);

    const toggle = () => setShowLogin(!showLogin);

    return (
        <div>{showLogin ? <SignIn onToggleAuth={toggle} /> : <SignUp onToggleAuth={toggle} />}</div>
    );
};

export default ToggleSignIn;
