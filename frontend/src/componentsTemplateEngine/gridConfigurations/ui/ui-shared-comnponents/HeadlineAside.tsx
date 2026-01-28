import { ComponentPropsWithoutRef, FC } from 'react';

const HeadlineAside: FC<ComponentPropsWithoutRef<'h2'>> = ({ children }) => {
    return <h2 className="text-lg font-bold py-4">{children}</h2>;
};

export default HeadlineAside;
