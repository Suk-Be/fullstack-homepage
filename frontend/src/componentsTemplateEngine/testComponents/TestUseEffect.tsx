import { FC, MouseEventHandler, ReactNode, useEffect, useRef, useState } from 'react';
import MarkupToggled from '../../componentsTemplateEngine/gridLayout/markUpGeneratorStatic/MarkupCode';
import ToggleAndCopyButtons from '../../componentsTemplateEngine/gridLayout/markUpGeneratorStatic/ToggleAndCopyButtonContainer';
import { buttonText } from '../../utils/templateEngine/buttonText';
import { componentToHtmlText, toDomModel } from '../../utils/templateEngine/parseHtmlToText';
/**
 * When to use useEffect?
 *
 * 1. When we want to perform side effects in a component
 * An effect is basically everything ouside react js system.
 * Effects let you run some code after rendering so that you can synchronize your component with some system outside of React.
 *
 * Examples: Basically anywhere it is needed to step out of react,
 * such as referencing a dom node,
 * using browser api's, fetching data,
 * using local/session storage,
 * these are all things outside of react scope also known as effects hence the name of the hook,
 * useEffect,
 * keep in mind react returns React elements and not pure html elements neither dom nodes
 * hence the reason you need to pass a ref to the jsx element if you want to get the real dom node
 */

// try with smaller component

const GridMarkup: FC<{ gridMarkupComponent: ReactNode }> = ({ gridMarkupComponent }) => {
    const elementRef = useRef(null);

    const [isShownMarkup, setShowMarkup] = useState({
        text: buttonText.showMarkup[0],
        isShown: false,
    });
    const [isCopiedText, setCopyText] = useState({
        text: buttonText.copyToClipboard[0],
        isCopied: false,
    });

    const clickHandlerShowMarkup: MouseEventHandler<HTMLButtonElement> = (ev) => {
        setShowMarkup((prevState) => ({
            text:
                prevState.text === buttonText.showMarkup[0]
                    ? buttonText.showMarkup[1]
                    : buttonText.showMarkup[0],
            isShown: !prevState.isShown,
        }));
    };

    const clickHandlerCopying: MouseEventHandler<HTMLButtonElement> = (ev) => {
        const html = toDomModel(componentToHtmlText(gridMarkupComponent)).body.firstChild;

        if (html) {
            navigator.clipboard.writeText(html.textContent || '');
        }

        setCopyText({
            text: buttonText.copyToClipboard[1],
            isCopied: true,
        });
        setTimeout(
            () =>
                setCopyText({
                    text: buttonText.copyToClipboard[0],
                    isCopied: false,
                }),
            750,
        );
    };

    useEffect(() => {
        const divElement = elementRef.current;
        console.log(divElement); // logs <div>I'm an element</div>
    }, []);

    return (
        <div ref={elementRef}>
            <MarkupToggled
                gridMarkupComponent={gridMarkupComponent}
                isShown={isShownMarkup.isShown}
            />
            <ToggleAndCopyButtons
                clickHandlerCopy={clickHandlerCopying}
                clickHandlerShowMarkupSetButtonText={clickHandlerShowMarkup}
                isShownMarkup={isShownMarkup}
                isCopiedText={isCopiedText}
            />
        </div>
    );
};

export default GridMarkup;
