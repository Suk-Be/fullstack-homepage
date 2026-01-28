import { testId } from '@/utils/testId';
import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Divider = ({ className = 'my-6' }: ComponentPropsWithoutRef<'hr'>) => {
    return <hr className={twMerge('text-white/20', className)} {...testId('hr')} />;
};
export default Divider;
