import { PropsWithChildren } from 'react';

const MainContainer = ({ children }: PropsWithChildren) => {
    return (
        <div
            className="
            flex-1 flex gap-2 
            p-4 pt-[6rem] lg:pt-[8rem] lg:p-10 
            flex-col lg:flex-row 
            full 
            bg-white text-gray-700"
        >
            {children}
        </div>
    );
};

export default MainContainer;
