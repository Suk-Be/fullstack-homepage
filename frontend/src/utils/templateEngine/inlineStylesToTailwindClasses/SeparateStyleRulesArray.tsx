/**
 * cleanupRegExpMatchArray
 * @param arr
 * @param elem
 * @returns a mutated array with all elem passed extracted
 */
function cleanupRegExpMatchArray(arr: string[] | null | undefined, elem: string) {
    if (!arr) return null;
    return arr.filter((item) => item !== elem);
}

/**
 * SeparateStyleRulesArray
 * @returns returns an array with style rules buit without the style tag
 * e.g. [ "display:grid", "grid-template-columns:repeat(1, minmax(0, 1fr))", "gap:0px",  "border-width:0rem", "padding:calc(0rem * 2) calc(0rem * 2)\""]
 */

const separateStyleRulesArray = (StyleAttributes: RegExpMatchArray | null) => {
    if (StyleAttributes !== null) {
        // Der Style-String enthält sowohl 'style="' als auch das schließende '"'
        const StyleRulesWithQuotes = StyleAttributes?.[0];

        if (!StyleRulesWithQuotes) {
            return [];
        }

        // Schneide 'style="' am Anfang und das letzte '"' am Ende ab
        const lengthOfStyleAttribute = 7; // Länge von 'style="'
        const cleanedStyleString = StyleRulesWithQuotes.substring(
            lengthOfStyleAttribute,
            StyleRulesWithQuotes.length - 1,
        );

        // Split am Semikolon
        const InlineStyleRulesAsArray = cleanedStyleString.split(';').map((rule) => rule.trim());

        // entfernt leere Einträge
        return cleanupRegExpMatchArray(InlineStyleRulesAsArray, '');
    }
    return null;
};

export default separateStyleRulesArray;
