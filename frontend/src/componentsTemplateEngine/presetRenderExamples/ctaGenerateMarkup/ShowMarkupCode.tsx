import { testId } from '@/utils/testId';
import { FC, ReactNode } from 'react';

const ShowMarkupCode: FC<{ component: ReactNode; isShown: boolean }> = ({ component, isShown }) => {
    return isShown ? (
        <div className="w-full h-full">
            <div className="w-full h-full" {...testId('markup-component')}>
                {component}
            </div>
        </div>
    ) : null;
};

export default ShowMarkupCode;
