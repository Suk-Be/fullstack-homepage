import { PropsWithChildren } from 'react';

const MainContainer = ({ children }: PropsWithChildren) => {
    return (
        <div className="flex-1 flex flex-wrap lg:flex-nowrap w-full bg-white text-gray-700">
            {children}
        </div>
    );
};

export default MainContainer;
