import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AccordionExpandIcon from './AccordionTeaser';
import SignIn from './SignIn/index';
import SignUp from './SignUp';

const ToggleSignIn = () => {
    const [showLogin, setShowLogin] = useState(true);

    const toggle = () => setShowLogin(!showLogin);

    return (
        <div>{showLogin ? <SignIn onToggleAuth={toggle} /> : <SignUp onToggleAuth={toggle} />}</div>
    );
};

const ToggleTeaser = () => {
  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

  return isLoggedIn ? <AccordionExpandIcon /> : <ToggleSignIn />;
}

export default ToggleTeaser;
