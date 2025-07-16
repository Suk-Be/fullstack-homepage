import { PropsWithChildren } from 'react';

const MainContainerPresets = ({ children }: PropsWithChildren) => {
    return (
        <div className="flex-1 flex pt-[6rem] lg:pt-[8rem] flex-col w-full p-4 lg:p-10 bg-white gap-2 text-gray-700">
            {children}
        </div>
    );
};

export default MainContainerPresets;
