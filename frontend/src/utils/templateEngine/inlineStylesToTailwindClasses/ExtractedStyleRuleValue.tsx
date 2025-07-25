import tranlateInlineStyleValuesToTailwindValues from './translateInlineStyleValuesToTailwindValues';

let styleType = {
    isGridCol: false,
    isGap: false,
    isBorder: false,
    isPadding: false,
};

const InlineStyleRules = {
    gridCols: 'grid-template-columns:',
    gridGap: 'gap:',
    borderWidth: 'border-width:',
    padding: 'padding:',
};

Object.freeze(InlineStyleRules);

const { gridCols, gridGap, borderWidth, padding } = InlineStyleRules;

const colValue = (InlineStyleRulesArray: RegExpMatchArray | null | undefined) => {
    return tranlateInlineStyleValuesToTailwindValues(
        gridCols,
        { ...styleType, isGridCol: true },
        InlineStyleRulesArray,
    );
};

const gapValue = (InlineStyleRulesArray: RegExpMatchArray | null | undefined) => {
    return tranlateInlineStyleValuesToTailwindValues(
        gridGap,
        { ...styleType, isGap: true },
        InlineStyleRulesArray,
    );
};

const borderWidthValue = (InlineStyleRulesArray: RegExpMatchArray | null | undefined) => {
    return tranlateInlineStyleValuesToTailwindValues(
        borderWidth,
        { ...styleType, isBorder: true },
        InlineStyleRulesArray,
    );
};

const paddingValues = (InlineStyleRulesArray: RegExpMatchArray | null | undefined) => {
    return tranlateInlineStyleValuesToTailwindValues(
        padding,
        { ...styleType, isPadding: true },
        InlineStyleRulesArray,
    );
};

export { borderWidthValue, colValue, gapValue, paddingValues };
