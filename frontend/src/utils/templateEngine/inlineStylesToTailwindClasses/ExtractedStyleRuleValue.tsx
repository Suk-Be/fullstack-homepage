/**
 * @param
 */
const ExtractedStyleRuleValue = (
    styleRule: string,
    styleType: { isGridCol: boolean; isGap: boolean; isBorder: boolean; isPadding: boolean },
    InlineStyleRulesArray: RegExpMatchArray | null | undefined,
) => {
    const findRule = (rule: string) =>
        InlineStyleRulesArray?.find((item: string | string[]) => item.includes(rule));
    let rule = findRule(styleRule);

    if (styleType.isGridCol && rule !== undefined) {
        /**
         * Get the dynamic column value of an inline style rule
         * e.g. grid-template-columns:repeat(10, minmax(0, 1fr)), number 10 is dynamic
         * on Layouts.tsx, console.log('rule', rule);
         */
        const lengthOfminmaxRule = rule.length - 17; // ', minmax(0, 1fr))'
        const deletedMinMaxRule = rule.substring(0, lengthOfminmaxRule);
        const lengthOfTemplateColumnnsRepeatRule = 28; // grid-template-columns:repeat(
        const colValue = deletedMinMaxRule
            .substring(lengthOfTemplateColumnnsRepeatRule)
            .replace('(', '');
        return colValue;
    }

    if (styleType.isGap && rule !== undefined) {
        /**
         * Get the dynamic gap value of an inline style rule
         * e.g. gap:32px, number 32 is dynamic
         * on Layouts.tsx, console.log('rule', rule);
         */
        const deletedPx = rule?.substring(0, rule.length - 2); // px
        const gapValue = deletedPx?.substring(4); // gap:
        return gapValue;
    }

    if (styleType.isBorder && rule !== undefined) {
        /**
         * Get the dynamic border-width value of an inline style rule
         * e.g. border-width:3rem, number 3 is dynamic
         * on Layouts.tsx, console.log('rule', rule);
         */
        const deletedRem = rule.substring(0, rule.length - 3); // rem
        const lengthOfBorderWidthRule = 13; // border-width:
        const borderWidthValue = deletedRem.substring(lengthOfBorderWidthRule);
        return borderWidthValue;
    }
    if (styleType.isPadding && rule !== undefined) {
        /**
         * Get the dynamic padding values for x and y directions
         * e.g. padding:calc(0rem * 2) calc(11rem * 2)"
         * number 0 is dynamic value for horizontal padding
         * number 11 is dynamic value for vertical padding
         * on Layouts.tsx, console.log('rule', rule);
         */
        const lengthOfPaddingRule = 8;
        const firstFactorRuleToFind = ' * 2';
        const firstCalcMethodToFind = 'calc(';
        const remValuesWithWith3MoreChars = rule
            .substring(lengthOfPaddingRule) // deletes padding
            .replace(firstFactorRuleToFind, '') // deletes ' * 2'
            .replace(firstFactorRuleToFind, '') // deletes ' * 2'
            .replace(' ', '') // deletes all whitespaces
            .replace(firstCalcMethodToFind, '') // deletes 'calc('
            .replace(firstCalcMethodToFind, ''); // deletes 'calc('

        const lastChars = remValuesWithWith3MoreChars.length - 2;
        const remValueWithoutLastChars = remValuesWithWith3MoreChars.substring(0, lastChars); // deletes ')"'
        const firstRemToFind = 'rem';
        const paddingValuesWrongOrder = remValueWithoutLastChars
            .replace(firstRemToFind, '')
            .replace(firstRemToFind, '')
            .split(')');

        const paddingValues = [paddingValuesWrongOrder[1], paddingValuesWrongOrder[0]];

        return paddingValues;
    }
};

let styleType = {
    isGridCol: false,
    isGap: false,
    isBorder: false,
    isPadding: false,
};

const StyleRuleDeclaration = {
    gridCols: 'grid-template-columns:',
    gridGap: 'gap:',
    borderWidth: 'border-width:',
    padding: 'padding:',
};

Object.freeze(StyleRuleDeclaration);

const colValue = (InlineStyleRulesArray: RegExpMatchArray | null | undefined) => {
    return ExtractedStyleRuleValue(
        StyleRuleDeclaration.gridCols,
        { ...styleType, isGridCol: true },
        InlineStyleRulesArray,
    );
};

const gapValue = (InlineStyleRulesArray: RegExpMatchArray | null | undefined) => {
    return ExtractedStyleRuleValue(
        StyleRuleDeclaration.gridGap,
        { ...styleType, isGap: true },
        InlineStyleRulesArray,
    );
};

const borderWidthValue = (InlineStyleRulesArray: RegExpMatchArray | null | undefined) => {
    return ExtractedStyleRuleValue(
        StyleRuleDeclaration.borderWidth,
        { ...styleType, isBorder: true },
        InlineStyleRulesArray,
    );
};

const paddingValues = (InlineStyleRulesArray: RegExpMatchArray | null | undefined) => {
    return ExtractedStyleRuleValue(
        StyleRuleDeclaration.padding,
        { ...styleType, isPadding: true },
        InlineStyleRulesArray,
    );
};

export { colValue, gapValue, borderWidthValue, paddingValues };
