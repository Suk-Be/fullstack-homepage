import {
    borderWidthValue as gridBorderWidthValue,
    colValue as gridColumnValue,
    gapValue as gridGapValue,
    paddingValues as padValues,
} from '@/utils/templateEngine/inlineStylesToTailwindClasses/extractedStyleRuleValue';
import extractTagAttributesForStyling from '@/utils/templateEngine/inlineStylesToTailwindClasses/extractTagAttributesForStyling';
import separateStyleRulesArray from '@/utils/templateEngine/inlineStylesToTailwindClasses/separateStyleRulesArray';
import { toTextOpeningTagFrom } from '@/utils/templateEngine/parseHtmlToText';
import { testId } from '@/utils/testId';
import { FC, JSXElementConstructor, ReactElement, ReactNode } from 'react';

type DynamicTagProps = {
    isDynamicInlineStyle?: boolean;
    Component: ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode>;
};

const OpeningTagWithTranspiledTailwindClasses: FC<DynamicTagProps> = ({
    isDynamicInlineStyle = false,
    Component,
}) => {
    const staticTailwindClasses = `grid border-gray-light/25`;
    let transpileInlineStylesToTailwind = ``;

    if (isDynamicInlineStyle) {
        // extracts style attributes and values from Component

        /* e.g. 
        extractTagAttributesForStyling(Component).styleAttributes;

        Component <div class="grid border-gray-light/25" style="display: grid; gap: 1rem;">
        returns 
        style="display: grid; gap: 1rem;"
        */
        const StyleAttributes = extractTagAttributesForStyling(Component).styleAttributes;

        // extracts inlinestyle rules and values as string[]

        /* e.g. 
        separateStyleRulesArray(StyleAttributes) // Needs const StyleAttributes = extractTagAttributesForStyling(Component).styleAttributes;

        StyleAttributes style="display: grid; gap: 1rem;"
        returns 
        ["display: grid", "gap: 1rem"]
        */
        const InlineStyleRulesArray = separateStyleRulesArray(StyleAttributes);

        // e.g. InlineStyleRulesArray ['display:grid', 'grid-template-columns:repeat(4, minmax(0, 1fr))', 'gap:3px', 'border-width:calc(2rem/3)', 'padding:calc(2rem/2) calc(3rem/2)']

        const colValue = gridColumnValue(InlineStyleRulesArray); // 'grid-template-columns:repeat(4, minmax(0, 1fr))' => 4
        const gapValue = gridGapValue(InlineStyleRulesArray); // 'gap:3px' => [3px]
        const borderValue = gridBorderWidthValue(InlineStyleRulesArray); // border-width:calc(2rem/3) => [0.67rem]
        const paddingValues = padValues(InlineStyleRulesArray); // padding:calc(2rem/2) calc(3rem/2) => ['[0.67rem]', '[1.5rem]']

        transpileInlineStylesToTailwind =
            colValue && gapValue && borderValue && paddingValues && paddingValues.length > 1
                ? `${staticTailwindClasses} col-span-${colValue} gap-${gapValue} border-${borderValue} px-${paddingValues[0]} py-${paddingValues[1]}`
                : '';
    }
    const DynComp = () => (
        <div className={isDynamicInlineStyle ? transpileInlineStylesToTailwind : ''}></div>
    );

    return (
        <code className="block pb-4" {...testId('opening-tag-inline-style')}>
            {isDynamicInlineStyle === true ? toTextOpeningTagFrom(<DynComp />) : null}
        </code>
    );
};

export default OpeningTagWithTranspiledTailwindClasses;
