import { testId } from '@/utils/testId';
import { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from 'tailwind-merge';

const GridElement: FC<ComponentPropsWithoutRef<'div'>> = ({ id, className }) => (
    <div
        className={twMerge('w-full rounded-xl', className)}
        id={id}
        {...testId('grid-element')}
    ></div>
);

export default GridElement;
