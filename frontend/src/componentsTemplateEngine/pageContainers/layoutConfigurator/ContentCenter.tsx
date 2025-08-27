import { testId } from '@/utils/testId';
import { PropsWithChildren } from 'react';

const ContentCenter = ({ children }: PropsWithChildren) => {
    return (
        <div
            className="
              flex order-1 lg:order-2 
              flex-col 
              w-full lg:w-5/6 bg-gray-100 
              pt-[2rem] pb-[2rem]
              lg:pt-[8rem] 
              justify-center items-center 
              mb-4 lg:mb-0"
            {...testId('content-center')}
        >
            {children}
        </div>
    );
};

export default ContentCenter;
