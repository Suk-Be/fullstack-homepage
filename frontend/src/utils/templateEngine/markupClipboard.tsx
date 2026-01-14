import CreateGridLayout from '@/componentsTemplateEngine/gridConfiguration/CreateGridLayout';
import CreateGridMarkUp from '@/componentsTemplateEngine/gridConfiguration/markUp/CreateGridMarkUp';
import { DynamicGridProps } from '@/types/templateEngine';
import {
    createHtmlAsTextFromPassedComponent,
    parseStringToADomModel,
} from '@/utils/templateEngine/parseHtmlToText';

type InlineStyles = DynamicGridProps['inlineStyles'];
type GridItemsArray = DynamicGridProps['gridItemsArray'];

const renderGridMarkup = (inlineStyles: InlineStyles, gridItemsArray: GridItemsArray) => (
    <CreateGridMarkUp Component={<CreateGridLayout style={inlineStyles} arr={gridItemsArray} />} />
);

async function copyGridMarkupToClipboard(
    inlineStyles: InlineStyles,
    gridItemsArray: GridItemsArray,
) {
    const markup = renderGridMarkup(inlineStyles, gridItemsArray);

    const htmlNode = parseStringToADomModel(createHtmlAsTextFromPassedComponent(markup)).body
        .firstChild;

    const text = htmlNode?.textContent ?? '';
    await navigator.clipboard.writeText(text);

    return text;
}

export { copyGridMarkupToClipboard, renderGridMarkup };
