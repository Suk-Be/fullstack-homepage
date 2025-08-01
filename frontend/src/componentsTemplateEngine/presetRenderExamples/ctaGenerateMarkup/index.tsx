import MarkupCode from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup/generateMarkup/MarkupCode';
import { copyButtonText, toggleButtonText } from '@/utils/templateEngine/buttonText';
import {
    createHtmlAsTextFromPassedComponent,
    parseStringToADomModel,
} from '@/utils/templateEngine/parseHtmlToText';
import { FC, MouseEventHandler, ReactNode, useState } from 'react';
import ToggleAndCopyButtonContainer from './ToggleAndCopyButtonContainer';

type ClickHandler = MouseEventHandler<HTMLButtonElement>;

const GenerateMarkupContainer: FC<{ component: ReactNode }> = ({ component }) => {
    // toggle State
    const [isToggledMarkup, toggleMarkup] = useState({
        text: toggleButtonText.showMarkup,
        isShown: false,
    });

    const clickHandlerShowMarkup: ClickHandler = () => {
        toggleMarkup((prevState) => ({
            text:
                prevState.text === toggleButtonText.showMarkup
                    ? toggleButtonText.hideMarkup
                    : toggleButtonText.showMarkup,
            isShown: !prevState.isShown,
        }));
    };

    // copy state
    const [isCopiedText, setCopyTextAndSetButtonText] = useState({
        text: copyButtonText.copyToClipboard,
        isCopied: false,
    });

    const clickHandlerCopy: ClickHandler = () => {
        const html = parseStringToADomModel(createHtmlAsTextFromPassedComponent(component)).body
            .firstChild;

        if (html) {
            navigator.clipboard.writeText(html.textContent || '');
        }

        setCopyTextAndSetButtonText({
            text: copyButtonText.isCopiedToClipboard,
            isCopied: true,
        });

        setTimeout(
            () =>
                setCopyTextAndSetButtonText({
                    text: copyButtonText.copyToClipboard,
                    isCopied: false,
                }),
            750,
        );
    };

    return (
        <>
            <MarkupCode component={component} isShown={isToggledMarkup.isShown} />
            <ToggleAndCopyButtonContainer
                clickHandlerCopy={clickHandlerCopy}
                clickHandlerToggle={clickHandlerShowMarkup}
                isShownMarkup={isToggledMarkup}
                isCopiedText={isCopiedText}
            />
        </>
    );
};

export default GenerateMarkupContainer;
