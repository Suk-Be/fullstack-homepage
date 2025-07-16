import { ComponentPropsWithoutRef, FC, MouseEventHandler } from 'react';
import CodeButton from '../../../componentsTemplateEngine/buttons/CodeButton';
import CopyButton from '../../../componentsTemplateEngine/buttons/CopyButton';
import { buttonText } from '../../../utils/templateEngine/buttonText';

interface ButtonContainerProps extends ComponentPropsWithoutRef<'button'> {
    clickHandlerShowMarkupSetButtonText?: MouseEventHandler<HTMLButtonElement> | undefined;
    clickHandlerCopy?: MouseEventHandler<HTMLButtonElement> | undefined;
    isShownMarkup: { text: string; isShown: boolean };
    isCopiedText: { text: string; isCopied: boolean };
}

const ToggleAndCopyButtonContainer: FC<ButtonContainerProps> = ({
    clickHandlerShowMarkupSetButtonText,
    clickHandlerCopy,
    isShownMarkup,
    isCopiedText,
}) => {
    return (
        <div className="w-full p-4">
            <div className="flex flex-col xl:flex-row pt-4 justify-end gap-2">
                <CodeButton onClick={clickHandlerShowMarkupSetButtonText}>
                    {isShownMarkup.isShown ? isShownMarkup.text : buttonText.showMarkup[0]}
                </CodeButton>
                <CopyButton onClick={clickHandlerCopy}>
                    {isCopiedText.isCopied ? isCopiedText.text : buttonText.copyToClipboard[0]}
                </CopyButton>
            </div>
        </div>
    );
};

export default ToggleAndCopyButtonContainer;
