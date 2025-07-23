import { FC, ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

const GridElement: FC<ComponentPropsWithoutRef<'div'>> = ({ id, className }) => (
    <div className={twMerge('w-full rounded-xl', className)} id={id}></div>
);

export default GridElement;
