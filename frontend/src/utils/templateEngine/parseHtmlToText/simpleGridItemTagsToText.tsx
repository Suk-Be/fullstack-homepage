import SimpleGrid from '@/componentsTemplateEngine/presetRenderExamples/grids/SimpleGrid';
import {
  createHtmlAsTextFromPassedComponent,
  parseStringToADomModel,
} from '@/utils/templateEngine/parseHtmlToText/index';

/**
 * Helper function to get a list of texts from the child nodes from a passed in react component
 * THis one is used on SimpleGrid Markup for Grid Example Page
 * @param Component: react component
 * @returns array of strings
 * example toTextChildNodesFrom(<SimpleGrid className="gap-4" />);
 * fyi: for the simple grrid all children nodes are exact
 */

const domSimpleGrid = parseStringToADomModel(
    createHtmlAsTextFromPassedComponent(<SimpleGrid layoutGapConfig="gap-4" />),
).body.firstChild?.childNodes;

const simpleGridItemTagsToText: string[] = Array.from(domSimpleGrid ?? []).map((elem) => {
    let gridItem = document.createElement('div');
    gridItem.appendChild(elem);
    // console.log('simpleGridItemTagsToText: ', gridItem.appendChild(elem))
    // logs: <div class="w-full rounded-xl h-24 bg-gray-light"></div>
    return gridItem?.innerHTML;
});

export default simpleGridItemTagsToText;
