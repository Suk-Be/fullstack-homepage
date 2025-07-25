import calculateAndFormatFraction from './calculateAndFormatFraction';

interface StyleType {
    isGridCol?: boolean; // Make optional if they are exclusive
    isGap?: boolean;
    isBorder?: boolean;
    isPadding?: boolean;
}

const tranlateInlineStyleValuesToTailwindValues = (
    styleRule: string,
    styleType: StyleType,
    InlineStyleRulesArray: RegExpMatchArray | null | undefined,
) => {
    // rule controller
    const findRule = (rule: string) =>
        InlineStyleRulesArray?.find((item: string | string[]) => item.includes(rule));
    let rule = findRule(styleRule);

    if (styleType.isGridCol && rule !== undefined) {
        /**
         * Get the dynamic column value of an inline style rule
         * e.g. grid-template-columns:repeat(10, minmax(0, 1fr)), number 10 is dynamic
         */
        const deleteGridTemplateColumns = rule.substring(22); // repeat(10, minmax(0, 1fr))
        const seperateColumnsString = deleteGridTemplateColumns.split(',')[0]; // repeat(10
        const colValue = seperateColumnsString.replace('repeat(', '');
        return colValue;
    }

    if (styleType.isGap && rule !== undefined) {
        /**
         * Get the dynamic gap value of an inline style rule
         * e.g. gap:7px
         */
        const deleteGap = rule?.substring(4); // 7px
        const gapValue = `[${deleteGap}]`;
        return gapValue;
    }

    if (styleType.isBorder && rule !== undefined) {
        /**
         * Get the dynamic border-width value of an inline style rule
         * e.g. border-width:3rem/3, number 3 is dynamic and one digit
         */
        const denominator = rule.slice(-1); // 3
        const lengthBorderWidth = 13;
        const deleteBorderWidth = rule.substring(lengthBorderWidth);
        const counter = deleteBorderWidth.slice(0, -5);
        const fraction = counter + '/' + denominator;
        const borderWidth = calculateAndFormatFraction(fraction);
        const borderWidthValue = `[${borderWidth}rem]`;
        return borderWidthValue;
    }
    if (styleType.isPadding && rule !== undefined) {
        /**
         * Get the dynamic padding values for x and y directions
         * e.g. padding:calc(0rem * 2) calc(11rem * 2)"
         * number 0 is dynamic value for horizontal padding
         * number 11 is dynamic value for vertical padding
         */

        // e.g. rule = padding: calc(5rem/2) calc(5rem/2)"
        const lengthOfPaddingRule = 8;
        const firstCalcMethodToFind = 'calc(';
        const stripOfPaddingAndCalc = rule
            .substring(lengthOfPaddingRule) // calc(5rem/2) calc(5rem/2)"
            .replace(' ', '') // calc(5rem/2)calc(5rem/2)"
            .replace(firstCalcMethodToFind, '') // 5rem/2)calc(5rem/2)"
            .replace(firstCalcMethodToFind, '') // 5rem/2)(5rem/2)"
            .replace(')"', ''); // 5rem/2)(5rem/2

        const firstRemToFind = 'rem';
        const yAndXValueInArray = stripOfPaddingAndCalc
            .replace(firstRemToFind, '') // 5/2)(5rem/2
            .replace(firstRemToFind, '') // 5/2)(5/2
            .split(')'); // array ['5/2', '5/2']

        const px = calculateAndFormatFraction(yAndXValueInArray[1]);
        const py = calculateAndFormatFraction(yAndXValueInArray[0]);

        const pxValue = `[${px}rem]`;
        const pyValue = `[${py}rem]`;

        const paddingValues = [pxValue, pyValue];

        return paddingValues;
    }
};

export default tranlateInlineStyleValuesToTailwindValues;
