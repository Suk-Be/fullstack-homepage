import { Button as UIButton } from '@headlessui/react';
import { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from 'tailwind-merge';

const Button: FC<ComponentPropsWithoutRef<'button'>> = ({ className, children, onClick }) => {
    return (
        <UIButton
            className={twMerge(
                `btn rounded mb-2 shadow-inner py-1 w-full 
                transition-all ease-in-out duration-100 
                 shadow-gray-light
                focus:outline-none 
                data-[hover]:text-green
                data-[hover]:bg-gray-dark 
                data-[open]:bg-gray-dark/700 
                data-[focus]:outline-1 
                data-[focus]:outline-white`,
                className,
            )}
            onClick={onClick}
        >
            {children}
        </UIButton>
    );
};

export default Button;
