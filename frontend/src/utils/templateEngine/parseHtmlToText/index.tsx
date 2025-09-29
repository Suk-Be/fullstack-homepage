import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSX } from 'react/jsx-runtime';

/**
 * Utilities to parse React Grid Component to HTML to render them as Code snippet
 */

export type ReactComponentLike =
    | string
    | number
    | bigint
    | boolean
    | Iterable<ReactNode>
    | Promise<
          | string
          | number
          | bigint
          | boolean
          | ReactPortal
          | ReactElement<unknown, string | JSXElementConstructor<unknown>>
          | Iterable<ReactNode>
          | null
          | undefined
      >
    | JSX.Element
    | null
    | undefined;

/**
 * Helper functions to return pieces markup of the same react component
 * @param Component: react component
 * @returns markup in one text string
 * example grid: componentToHtmlText(<SimpleGrid className="gap-4" />);
 */
const createHtmlAsTextFromPassedComponent = (Component: ReactComponentLike) =>
    renderToStaticMarkup(Component);

/**
 * Helper function to to create a Dom model that can be traversed by its dom objects
 * @param componentToHtmlText: string
 * @returns a Dom model
 */
const parser = new DOMParser();
const parseStringToADomModel = (componentToHtmlText: string) =>
    parser.parseFromString(componentToHtmlText, 'text/html');

/**
 * Helper function to get the text code of the parent node from a passed in react component
 * @param Component: react component
 * @returns a string with two tags (opening and closing)
 */
const toTextParentNode = (
    Component: ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode>,
) => {
    const parentNode = parseStringToADomModel(createHtmlAsTextFromPassedComponent(Component)).body
        .firstChild;
    while (parentNode?.firstChild) {
        parentNode.removeChild(parentNode?.firstChild);
    }
    return parentNode?.parentElement?.innerHTML;
};

/**
 * Helper function to get the opening tag of the passed in react component
 * @param Component
 * @returns only opening tag (<div>)
 * example: toTextOpeningTag(<SimpleGrid className="gap-4" />);
 */
const toTextOpeningTagFrom = (
    Component: ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode>,
) => {
    const parentNodeText = toTextParentNode(Component);
    if (typeof parentNodeText === 'string') {
        const lengthClosingTag = parentNodeText.length - 6;
        const openingTag = parentNodeText.slice(0, lengthClosingTag);
        return openingTag;
    }
    return '';
};

/**
 * Helper function to get the closing tag of the passed in react component
 * @param Component
 * @returns only closing tag (</div>)
 * example: toTextClosingTagFrom(<SimpleGrid className="gap-4" />);
 */
const toTextClosingTagFrom = (
    Component: ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode>,
) => {
    const parentNodeText = toTextParentNode(Component);
    if (typeof parentNodeText === 'string') {
        const lengthClosingTag = -6;
        const closingTag = parentNodeText.slice(lengthClosingTag);
        return closingTag;
    }
    return '';
};

export {
    createHtmlAsTextFromPassedComponent,
    parseStringToADomModel,
    toTextClosingTagFrom,
    toTextOpeningTagFrom,
    toTextParentNode,
};
