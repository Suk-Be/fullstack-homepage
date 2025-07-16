import { PropsWithChildren } from 'react';

const Headline = ({ children }: PropsWithChildren) => (
    <h2 className="text-3xl text-green-dark text-gray-700 p-4">{children}</h2>
);
export default Headline;
