import RowspanningGrid from '../../../componentsTemplateEngine/gridLayout/layoutPresets/RowspanningGrid';
import {
    componentToHtmlText,
    toDomModel,
} from '../../../utils/templateEngine/parseHtmlToText/index';

/**
 * Helper function to get a list of texts from the child nodes from a passed in react component
 * @param Component: react component
 * @returns array of strings
 * example toTextChildNodesFrom(<SimpleGrid className="gap-4" />);
 * fyi: all children nodes are not exact some have col-span and row-span utitity classes
 */

const domRowSpanningGrid = toDomModel(componentToHtmlText(<RowspanningGrid />)).body.firstChild
    ?.childNodes;

const rowSpanningGridTagsToText = Array.from(domRowSpanningGrid ?? []).map((elem) => {
    let tmp = document.createElement('div');
    tmp.appendChild(elem);
    return tmp?.innerHTML;
});

export default rowSpanningGridTagsToText;
