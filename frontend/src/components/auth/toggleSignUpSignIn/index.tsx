import SignIn from '@/components/auth/toggleSignUpSignIn/signIn/index';
import SignUp from '@/components/auth/toggleSignUpSignIn/signUp';
import { useBoolean } from '@/hooks/useBoolean';

const ToggleSignIn = () => {
    const toggleObj = useBoolean(true);

    return (
        <div>
            {toggleObj.value ? (
                <SignIn onToggleAuth={toggleObj.toggle} />
            ) : (
                <SignUp onToggleAuth={toggleObj.toggle} />
            )}
        </div>
    );
};

export default ToggleSignIn;
