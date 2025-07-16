import { PropsWithChildren } from 'react';

const AsideLeft = ({ children }: PropsWithChildren) => {
    return (
        <div className="flex flex-col z-10 order-2 rounded-lg bg-gray-dark text-white lg:order-1 flex-wrap m-auto lg:m-0 w-full lg:w-1/6 p-8 lg:p-4 overflow-y-auto max-h-full max-height: 95.3vh">
            {children}
        </div>
    );
};

export default AsideLeft;
