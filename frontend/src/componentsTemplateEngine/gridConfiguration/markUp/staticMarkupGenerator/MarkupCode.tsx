import { testId } from '@/utils/testId';
import { FC, ReactNode } from 'react';

const MarkupCode: FC<{ gridMarkupComponent: ReactNode; isShown: boolean }> = ({
    gridMarkupComponent,
    isShown,
}) => {
    return isShown ? (
        <div className="w-full h-full">
            <div className="w-full h-full" {...testId('markup-component')}>
                {gridMarkupComponent}
            </div>
        </div>
    ) : null;
};

export default MarkupCode;
