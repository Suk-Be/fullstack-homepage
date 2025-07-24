import { PropsWithChildren } from 'react';

const AsideRight = ({ children }: PropsWithChildren) => {
    return (
        <div
            className="
            flex order-3 flex-wrap 
            rounded-lg 
            bg-gray-dark text-white 
            m-auto lg:m-0 
            w-full lg:w-1/6 
            md:p-8 lg:p-4 
            border-2 
            overflow-y-auto 
            max-h-full max-height: 95.3vh"
        >
            <div
                className="
                  flex flex-col 
                  w-full h-full 
                  px-12 lg:px-0 
                  md:gap-4"
            >
                {children}
            </div>
        </div>
    );
};

export default AsideRight;
