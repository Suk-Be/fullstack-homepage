import { useAppSelector } from '@/store/hooks';
import { selectIsLoggedIn } from '@/store/selectors/loginSelectors';
import AccordionExpandIcon from './accordionTeaser';
import ToggleSignIn from './toggleSignUpSignIn';

const ToggleTeaser = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    return isLoggedIn ? <AccordionExpandIcon /> : <ToggleSignIn />;
};

export default ToggleTeaser;
