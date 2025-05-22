import { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

const ToggleSignIn = () => {
    const [showLogin, setShowLogin] = useState(false);

    const toggle = () => setShowLogin(!showLogin);

    return (
        <div>
            <button onClick={toggle}>Switch to {showLogin ? 'Register' : 'Login'}</button>

            {showLogin ? <SignIn /> : <SignUp />}
        </div>
    );
};

export default ToggleSignIn;
