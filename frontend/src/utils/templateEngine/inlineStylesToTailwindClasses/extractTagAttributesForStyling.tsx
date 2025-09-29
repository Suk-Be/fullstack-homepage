import { toTextOpeningTagFrom } from '@/utils/templateEngine/parseHtmlToText';
import { JSXElementConstructor, ReactElement, ReactNode } from 'react';

type Component =
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | Iterable<ReactNode>;
/**
 * Helper function for the ParentTag Component to transpile and merge TagAttributes
 *
 * @param The passed in Component html tag with a class and style attribute. The class uses tailwind classes and the style uses inline styles
 * @returns an array with those attributes
 *
 * e.g. [
 *  "class="grid border-gray-light/25",
 *  "style="display:grid;grid-template-columns:repeat(1, minmax(0, 1fr));gap:0px;border-width:0rem;padding:calc(1rem * 2) calc(4rem * 2)"
 * ]
 */
const extractTagAttributesForStyling = (Component: Component) => {
    const OpeningTag = toTextOpeningTagFrom(Component);
    const getStyleAttributeValues = OpeningTag.match(/style\s*=\s*"([^"]*)"/gm);
    const getClassAttributeValues = OpeningTag.match(/class\s*=\s*"([^"]*)"/gm);
    const TagAttributes = {
        styleAttributes: getStyleAttributeValues,
        classAttributes: getClassAttributeValues,
    };

    return TagAttributes;
};

export default extractTagAttributesForStyling;
