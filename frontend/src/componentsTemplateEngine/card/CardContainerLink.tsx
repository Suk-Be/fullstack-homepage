import { ComponentPropsWithoutRef, FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardContainerLinkProps {
    href?: string | undefined;
    id?: string | undefined;
    dataImage: boolean;
    ariaLabel: string;
}

const containerStyling =
    'group flex items-start gap-6 p-6 overflow-hidden rounded-lg bg-gray-dark shadow-card ring-1 ring-green/[0.2] transition duration-300 hover:text-green/70 group-hover:ring-green/[1] focus:outline-none focus-visible:ring-green-dark lg:pb-10';
const containerStylingWithImage = 'md:row-span-3 flex-col lg:p-10 ';

const conditionalStyling = (isTeaserImage: boolean) =>
    isTeaserImage ? twMerge(containerStyling, containerStylingWithImage) : containerStyling;

const CardContainerLink: FC<PropsWithChildren<CardContainerLinkProps>> = ({
    children,
    href,
    id,
    dataImage,
    ariaLabel,
}) => {
    return (
        <a href={href} id={id} className={conditionalStyling(dataImage)} aria-label={ariaLabel}>
            {children}
        </a>
    );
};

const CardContainerDiv: FC<ComponentPropsWithoutRef<'div'>> = ({ children, id }) => {
    return (
        <div id={id} className={containerStyling}>
            {children}
        </div>
    );
};

export default CardContainerLink;
export { CardContainerDiv };
