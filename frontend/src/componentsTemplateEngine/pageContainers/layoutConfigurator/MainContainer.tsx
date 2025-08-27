import { testId } from '@/utils/testId';
import { PropsWithChildren } from 'react';

const MainContainer = ({ children }: PropsWithChildren) => {
    return (
        <div
            className="
            flex-1 flex md:gap-2 
            md:p-4 pt-[6rem] lg:pt-[8rem] lg:p-10 
            flex-col lg:flex-row 
            full 
            bg-white text-gray-700"
            {...testId('main-container')}
        >
            {children}
        </div>
    );
};

export default MainContainer;
