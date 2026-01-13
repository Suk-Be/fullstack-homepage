import { DynamicGridProps } from '@/types/templateEngine';

type InlineStyles = DynamicGridProps['inlineStyles'];
type GridItemsArray = DynamicGridProps['gridItemsArray'];

const getInlineStylesFromConfig = (config: any): InlineStyles => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))`,
    gap: `${config.gap}px`,
    borderWidth: `calc(${config.border}rem/3)`,
    padding: `calc(${config.paddingY}rem/2) calc(${config.paddingX}rem/2)`,
});

const getGridItemsArrayFromConfig = (config: any): GridItemsArray => {
    const gridItems = parseInt(String(config.items), 10) || 0;
    return Array.from({ length: gridItems }, (_, i) => i + 1);
};

const buildGridRenderPropsFromConfig = (config: any) => {
    const inlineStyles = getInlineStylesFromConfig(config);
    const gridItemsArray = getGridItemsArrayFromConfig(config);

    return { inlineStyles, gridItemsArray };
};

export { buildGridRenderPropsFromConfig, getGridItemsArrayFromConfig, getInlineStylesFromConfig };
