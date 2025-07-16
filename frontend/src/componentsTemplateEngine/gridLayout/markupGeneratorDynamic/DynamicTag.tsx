import { FC, JSXElementConstructor, ReactElement, ReactNode } from 'react';
import {
    borderWidthValue as gridBorderWidthValue,
    colValue as gridColumnValue,
    gapValue as gridGapValue,
    paddingValues as padValues,
} from '../../../utils/templateEngine/inlineStylesToTailwindClasses/ExtractedStyleRuleValue';
import ExtractTagAttributes from '../../../utils/templateEngine/inlineStylesToTailwindClasses/ExtractTagAttributes';
import SeparateStyleRulesArray from '../../../utils/templateEngine/inlineStylesToTailwindClasses/SeparateStyleRulesArray';
import { toTextOpeningTagFrom } from '../../../utils/templateEngine/parseHtmlToText';

type DynamicTagProps = {
    isDynamicTag?: boolean;
    Component: ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode>;
};

const DynamicTag: FC<DynamicTagProps> = ({ isDynamicTag = false, Component }) => {
    const staticTailwindClasses = `grid border-gray-light/25`;
    let dynamicTranspiledInlineStylesToTailwindClasses = ``;

    if (isDynamicTag) {
        const StyleAttributes = ExtractTagAttributes(Component).styleAttributes;
        const InlineStyleRulesArray = SeparateStyleRulesArray(StyleAttributes);

        const colValue = gridColumnValue(InlineStyleRulesArray);
        const gapValue = gridGapValue(InlineStyleRulesArray);
        const borderValue = gridBorderWidthValue(InlineStyleRulesArray);
        const paddingValues = padValues(InlineStyleRulesArray);

        dynamicTranspiledInlineStylesToTailwindClasses =
            colValue && gapValue && borderValue && paddingValues && paddingValues.length > 1
                ? `${staticTailwindClasses} col-span-${colValue} gap-${gapValue} border-${borderValue} px-${paddingValues[0]} py-${paddingValues[1]}`
                : '';
    }
    const DynComp = () => (
        <div className={isDynamicTag ? dynamicTranspiledInlineStylesToTailwindClasses : ''}></div>
    );

    return (
        <code className="block pb-4">
            {isDynamicTag === true ? toTextOpeningTagFrom(<DynComp />) : null}
        </code>
    );
};

export default DynamicTag;
