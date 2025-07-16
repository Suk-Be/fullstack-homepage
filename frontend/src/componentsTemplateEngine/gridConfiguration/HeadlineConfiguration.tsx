import { ComponentPropsWithoutRef, FC } from 'react';

const HeadlineConfiguration: FC<ComponentPropsWithoutRef<'h2'>> = ({ children }) => {
    return <h2 className="text-lg font-bold py-4">{children}</h2>;
};

export default HeadlineConfiguration;
