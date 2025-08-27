import { useCallback, useState } from 'react';

export default function useToggle(initialValue = false) {
    const [value, toggleValue] = useState(initialValue);

    // Memoized callback function
    const toggle = useCallback(() => {
        toggleValue((prev) => !prev);
    }, []);

    return [value, toggle] as const;
}
