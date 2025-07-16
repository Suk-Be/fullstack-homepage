import { FC, ComponentPropsWithoutRef } from 'react';

const CardHeadline: FC<ComponentPropsWithoutRef<'h2'>> = ({ children }) => {
    return <h2 className="text-xl font-semibold">{children}</h2>;
};

export default CardHeadline;
