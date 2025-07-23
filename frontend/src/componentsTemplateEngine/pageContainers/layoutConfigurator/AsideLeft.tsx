import { PropsWithChildren } from 'react';

const AsideLeft = ({ children }: PropsWithChildren) => {
    return (
        <div
            className="
            flex flex-col flex-wrap 
            order-2 lg:order-1 
            rounded-lg 
            bg-gray-dark text-white 
            m-auto lg:m-0 
            w-full lg:w-1/6 p-8 
            lg:p-4 
            overflow-y-auto 
            max-h-full max-height: 95.3vh"
        >
            {children}
        </div>
    );
};

export default AsideLeft;
