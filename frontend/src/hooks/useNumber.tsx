import { useState } from 'react';

type UseNumberOptions = {
    onChange?: (value: number | null) => void;
};

export const useNumber = (initial: number | null = null, opts?: UseNumberOptions) => {
    const [value, setValue] = useState<number | null>(initial);

    const onChange = (_e: React.SyntheticEvent, newValue: number | null) => {
        setValue(newValue);
        opts?.onChange?.(newValue);
    };

    const clear = () => {
        setValue(null);
        opts?.onChange?.(null);
    };

    return {
        value,
        setValue,
        onChange,
        clear,
    };
};
