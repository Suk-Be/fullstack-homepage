import Button from '@/componentsTemplateEngine/buttons/Button';
import { toggleButtonText } from '@/utils/templateEngine/buttonText';
import { ComponentPropsWithoutRef, FC } from 'react';
import { HideCodeSVG, ShowCodeSVG } from '../svgs';

const CodeButton: FC<ComponentPropsWithoutRef<'button'>> = ({ onClick, children }) => {
    const SVG = () => {
        if (children === toggleButtonText.hideMarkup) {
            return <HideCodeSVG className="size-6 pr-2 animate-ping repeat-1" />;
        }

        return <ShowCodeSVG className="size-6 pr-2" />;
    };

    return (
        <Button
            className="bg-gray font-medium 
          py-4 rounded-xl 
          text-gray-dark group"
            onClick={onClick}
        >
            <span className="flex items-center justify-center">
                <SVG />
                <span>{children}</span>
            </span>
        </Button>
    );
};

export default CodeButton;
