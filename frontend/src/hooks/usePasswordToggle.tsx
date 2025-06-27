import { useCallback, useState } from 'react';

const usePasswordToggle = () => {
    const [showPassword, setShowPassword] = useState(false);

    // Memoized callback function to toggle the password visibility
    const handleTogglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    return { showPassword, handleTogglePassword };
};

export default usePasswordToggle