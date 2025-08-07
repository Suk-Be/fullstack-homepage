import GridMarkupWrapper from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup/generateMarkup/GridMarkupWrapper';
import RowspanningGrid from '@/componentsTemplateEngine/presetRenderExamples/grids/RowspanningGrid';
import rowSpanningGridItemTagsToText from '@/utils/templateEngine/parseHtmlToText/rowSpanningGridItemTagsToText';
import { ComponentPropsWithoutRef, FC } from 'react';

const RowspanningGridMarkup: FC<ComponentPropsWithoutRef<'div'>> = () => {
    return (
        <GridMarkupWrapper
            markupComponent={<RowspanningGrid />}
            childrenTagsArr={rowSpanningGridItemTagsToText}
        />
    );
};

export default RowspanningGridMarkup;
