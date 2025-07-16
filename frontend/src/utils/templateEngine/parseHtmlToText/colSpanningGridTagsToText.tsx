import ColspanningGrid from '../../../componentsTemplateEngine/gridLayout/layoutPresets/ColspanningGrid';
import {
    componentToHtmlText,
    toDomModel,
} from '../../../utils/templateEngine/parseHtmlToText/index';

/**
 * Helper function to get a list of texts from the child nodes from a passed in react component
 * @param Component: react component
 * @returns array of strings
 * example toTextChildNodesFrom(<SimpleGrid className="gap-4" />);
 * fyi: for the simple grrid all children nodes are exact
 */

const domColumnSpanningGrid = toDomModel(
    componentToHtmlText(<ColspanningGrid className="col-span-2" />),
).body.firstChild?.childNodes;

const colSpanningGridTagsToText = Array.from(domColumnSpanningGrid ?? []).map((elem) => {
    let tmp = document.createElement('div');
    tmp.appendChild(elem);
    return tmp?.innerHTML;
});

export default colSpanningGridTagsToText;
