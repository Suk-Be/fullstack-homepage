/**
 * cleanupRegExpMatchArray
 * @param arr
 * @param elem
 * @returns a mutated array with all elem passed extracted
 */
function cleanupRegExpMatchArray(arr: RegExpMatchArray | null | undefined, elem: string) {
    arr?.forEach((item, index) => {
        if (item === elem) arr.splice(index, 1);
    });
    return arr;
}

/**
 * SeparateStyleRulesArray
 * @returns returns an array with style rules buit without the style tag
 * e.g. [ "display:grid", "grid-template-columns:repeat(1, minmax(0, 1fr))", "gap:0px",  "border-width:0rem", "padding:calc(0rem * 2) calc(0rem * 2)\""]
 */

const separateStyleRulesArray = (StyleAttributes: RegExpMatchArray | null) => {
    if (StyleAttributes !== null) {
        const lengthOfStyleAttribute = 7;
        // returns deletes style attribute from the single string
        const StyleRules = StyleAttributes?.[0]?.substring(lengthOfStyleAttribute);
        const RegExArrayWithStyleRulesAndRedundantSpaceEntries = StyleRules?.match(/[^;]*/gm);
        // deletes redundant list entries
        const InlineStyleRulesAsArray = cleanupRegExpMatchArray(
            RegExArrayWithStyleRulesAndRedundantSpaceEntries,
            '',
        );

        return InlineStyleRulesAsArray;
    }
};

export default separateStyleRulesArray;
