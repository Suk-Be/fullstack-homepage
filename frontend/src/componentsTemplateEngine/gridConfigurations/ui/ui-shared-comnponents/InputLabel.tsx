import { Label } from '@headlessui/react';
import { ComponentPropsWithoutRef, FC } from 'react';
const InputLabel: FC<ComponentPropsWithoutRef<'label'>> = ({ children }) => {
    return <Label className="ineline-block pr-1">{children}</Label>;
};

export default InputLabel;
