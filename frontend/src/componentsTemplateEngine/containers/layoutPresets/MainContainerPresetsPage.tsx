import { PropsWithChildren } from 'react';

const MainContainerPresets = ({ children }: PropsWithChildren) => {
    return (
        <div
            className="
            flex-1 flex flex-col 
            p-4 pt-[6rem] lg:pt-[8rem] lg:p-10 
            w-full p-4 bg-white 
            gap-2 text-gray-700"
        >
            {children}
        </div>
    );
};

export default MainContainerPresets;
