import { testId } from '@/utils/testId';
import { PropsWithChildren } from 'react';

const AsideRight = ({ children }: PropsWithChildren) => {
    return (
        <aside
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
            {...testId('aside-right')}
        >
            <div
                className="
                  w-full h-full mx-8 lg:mx-0
                  grid grid-cols-3 lg:grid-cols-1 gap-8"
            >
                {children}
            </div>
        </aside>
    );
};

export default AsideRight;
