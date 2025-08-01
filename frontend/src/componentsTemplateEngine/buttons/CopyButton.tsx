import Button from '@/componentsTemplateEngine/buttons/Button';
import { copyButtonText } from '@/utils/templateEngine/buttonText';
import { ComponentPropsWithoutRef, FC } from 'react';
import { CopySVG, IsCopiedSVG } from '../svgs';

const CopyButton: FC<ComponentPropsWithoutRef<'button'>> = ({ onClick, children }) => {
    const SVG = () => {
        if (children === copyButtonText.isCopiedToClipboard) {
            return <IsCopiedSVG className="size-6 pr-2 animate-ping repeat-1" />;
        }

        return <CopySVG className="size-6 pr-2" />;
    };

    return (
        <Button
            className="py-4 rounded-xl 
              text-white 
              bg-gray-dark
              data-[hover]:bg-gray 
              data-[open]:bg-gray/700"
            onClick={onClick}
        >
            <span className="flex items-center justify-center">
                <SVG />
                <span>{children}</span>
            </span>
        </Button>
    );
};

export default CopyButton;
