import {
    borderWidthValue as gridBorderWidthValue,
    colValue as gridColumnValue,
    gapValue as gridGapValue,
    paddingValues as padValues,
} from '@/utils/templateEngine/inlineStylesToTailwindClasses/extractedStyleRuleValue';
import extractTagAttributes from '@/utils/templateEngine/inlineStylesToTailwindClasses/extractTagAttributes';
import separateStyleRulesArray from '@/utils/templateEngine/inlineStylesToTailwindClasses/separateStyleRulesArray';
import { toTextOpeningTagFrom } from '@/utils/templateEngine/parseHtmlToText';
import { FC, JSXElementConstructor, ReactElement, ReactNode } from 'react';

type DynamicTagProps = {
    isDynamicInlineStyle?: boolean;
    Component: ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode>;
};

const DivWithTranspiledTailwindClasses: FC<DynamicTagProps> = ({
    isDynamicInlineStyle = false,
    Component,
}) => {
    const staticTailwindClasses = `grid border-gray-light/25`;
    let dynamicTranspiledInlineStylesToTailwindClasses = ``;

    if (isDynamicInlineStyle) {
        const StyleAttributes = extractTagAttributes(Component).styleAttributes;
        const InlineStyleRulesArray = separateStyleRulesArray(StyleAttributes);

        const colValue = gridColumnValue(InlineStyleRulesArray);
        const gapValue = gridGapValue(InlineStyleRulesArray);
        // console.log('gapValue: ', gapValue + 'rem');
        const borderValue = gridBorderWidthValue(InlineStyleRulesArray);
        const paddingValues = padValues(InlineStyleRulesArray);

        dynamicTranspiledInlineStylesToTailwindClasses =
            colValue && gapValue && borderValue && paddingValues && paddingValues.length > 1
                ? `${staticTailwindClasses} col-span-${colValue} gap-${gapValue} border-${borderValue} px-${paddingValues[0]} py-${paddingValues[1]}`
                : '';
    }
    const DynComp = () => (
        <div
            className={isDynamicInlineStyle ? dynamicTranspiledInlineStylesToTailwindClasses : ''}
        ></div>
    );

    return (
        <code className="block pb-4">
            {isDynamicInlineStyle === true ? toTextOpeningTagFrom(<DynComp />) : null}
        </code>
    );
};

export default DivWithTranspiledTailwindClasses;
