import CodeButton from '@/componentsTemplateEngine/buttons/CodeButton';
import CopyButton from '@/componentsTemplateEngine/buttons/CopyButton';
import { copyButtonText, toggleButtonText } from '@/utils/templateEngine/buttonText';
import { ComponentPropsWithoutRef, FC, MouseEventHandler } from 'react';

interface ButtonContainerProps extends ComponentPropsWithoutRef<'button'> {
    clickHandlerToggle?: MouseEventHandler<HTMLButtonElement> | undefined;
    clickHandlerCopy?: MouseEventHandler<HTMLButtonElement> | undefined;
    isShownMarkup: { text: string; isShown: boolean };
    isCopiedText: { text: string; isCopied: boolean };
}

const ToggleAndCopyButtonContainer: FC<ButtonContainerProps> = ({
    clickHandlerToggle,
    clickHandlerCopy,
    isShownMarkup,
    isCopiedText,
}) => {
    return (
        <div className="w-full p-4">
            <div className="flex flex-col xl:flex-row pt-4 justify-end gap-2">
                <CodeButton onClick={clickHandlerToggle}>
                    {isShownMarkup.isShown ? isShownMarkup.text : toggleButtonText.showMarkup}
                </CodeButton>
                <CopyButton onClick={clickHandlerCopy}>
                    {isCopiedText.isCopied ? isCopiedText.text : copyButtonText.copyToClipboard}
                </CopyButton>
            </div>
        </div>
    );
};

export default ToggleAndCopyButtonContainer;
