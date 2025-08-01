import SimpleGrid from '@/componentsTemplateEngine/presetRenderExamples/SimpleGrid';
import {
    createHtmlAsTextFromPassedComponent,
    parseStringToADomModel,
} from '@/utils/templateEngine/parseHtmlToText/index';

/**
 * Helper function to get a list of texts from the child nodes from a passed in react component
 * @param Component: react component
 * @returns array of strings
 * example toTextChildNodesFrom(<SimpleGrid className="gap-4" />);
 * fyi: for the simple grrid all children nodes are exact
 */

const domSimpleGrid = parseStringToADomModel(
    createHtmlAsTextFromPassedComponent(<SimpleGrid layoutGapConfig="gap-4" />),
).body.firstChild?.childNodes;

const simpleGridChildrenTagsToText = Array.from(domSimpleGrid ?? []).map((elem) => {
    let tmp = document.createElement('div');
    tmp.appendChild(elem);
    return tmp?.innerHTML;
});

export default simpleGridChildrenTagsToText;
