import { buttonText } from '@/utils/templateEngine/buttonText';
import {
    createHtmlAsTextFromPassedComponent,
    parseStringToADomModel,
} from '@/utils/templateEngine/parseHtmlToText';
import { FC, MouseEventHandler, ReactNode, useState } from 'react';
import MarkupCode from './MarkupCode';
import ToggleAndCopyButtonContainer from './ToggleAndCopyButtonContainer';

const MarkupGenerator: FC<{ gridMarkupComponent: ReactNode }> = ({ gridMarkupComponent }) => {
    const [isShownMarkupAndButtonText, setShowMarkupAndsetButtonText] = useState({
        text: buttonText.showMarkup[0],
        isShown: false,
    });

    const clickHandlerShowMarkupSetButtonText: MouseEventHandler<HTMLButtonElement> = () => {
        setShowMarkupAndsetButtonText((prevState) => ({
            text:
                prevState.text === buttonText.showMarkup[0]
                    ? buttonText.showMarkup[1]
                    : buttonText.showMarkup[0],
            isShown: !prevState.isShown,
        }));
    };

    const [isCopiedText, setCopyTextAndSetButtonText] = useState({
        text: buttonText.copyToClipboard[0],
        isCopied: false,
    });

    const clickHandlerCopy: MouseEventHandler<HTMLButtonElement> = () => {
        const html = parseStringToADomModel(
            createHtmlAsTextFromPassedComponent(gridMarkupComponent),
        ).body.firstChild;

        if (html) {
            navigator.clipboard.writeText(html.textContent || '');
        }

        setCopyTextAndSetButtonText({
            text: buttonText.copyToClipboard[1],
            isCopied: true,
        });

        setTimeout(
            () =>
                setCopyTextAndSetButtonText({
                    text: buttonText.copyToClipboard[0],
                    isCopied: false,
                }),
            750,
        );
    };

    return (
        <>
            <MarkupCode
                gridMarkupComponent={gridMarkupComponent}
                isShown={isShownMarkupAndButtonText.isShown}
            />
            <ToggleAndCopyButtonContainer
                clickHandlerCopy={clickHandlerCopy}
                clickHandlerShowMarkupSetButtonText={clickHandlerShowMarkupSetButtonText}
                isShownMarkup={isShownMarkupAndButtonText}
                isCopiedText={isCopiedText}
            />
        </>
    );
};

export default MarkupGenerator;
