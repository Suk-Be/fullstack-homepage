import GridMarkupWrapper from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/GridMarkupWrapper';
import RowspanningGrid from '@/componentsTemplateEngine/presetRenderExamples/RowspanningGrid';
import rowSpanningGridTagsToText from '@/utils/templateEngine/parseHtmlToText/rowSpanningGridTagsToText';
import { ComponentPropsWithoutRef, FC } from 'react';

const RowspanningGridMarkup: FC<ComponentPropsWithoutRef<'div'>> = () => {
    return (
        <GridMarkupWrapper
            markupComponent={<RowspanningGrid />}
            childrenTagsArr={rowSpanningGridTagsToText}
        />
    );
};

export default RowspanningGridMarkup;
