import { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface LogoProps {
    logoStyling: string;
    sublineStyling: string;
}

const Name: FC<ComponentPropsWithoutRef<'div'>> = ({ className }) => {
    return (
        <div className={twMerge('font-eczar font-extrabold text-green-dark', className)}>
            Suk-Be Jang
        </div>
    );
};

const Profession: FC<ComponentPropsWithoutRef<'div'>> = ({ className }) => {
    return (
        <div className={twMerge('font-fira font-thin text-green-dark', className)}>
            Web Developer
        </div>
    );
};

const Logo: FC<LogoProps> = ({ logoStyling, sublineStyling }) => {
    return (
        <div className="flex flex-col items-center" role="img" aria-label="logo">
            <Name className={logoStyling} />
            <Profession className={sublineStyling} />
        </div>
    );
};

export default Logo;
