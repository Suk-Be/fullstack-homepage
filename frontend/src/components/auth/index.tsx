import { RootState } from '@/store/';
import { useSelector } from 'react-redux';
import AccordionExpandIcon from './AccordionTeaser';
import ToggleSignIn from './Toggles';

const ToggleTeaser = () => {
    const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

    return isLoggedIn ? <AccordionExpandIcon /> : <ToggleSignIn />;
};

export default ToggleTeaser;
