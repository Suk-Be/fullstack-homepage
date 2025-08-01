import RowspanningGrid from '@/componentsTemplateEngine/presetRenderExamples/RowspanningGrid';
import GridMarkupWrapper from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup/generateMarkup/GridMarkupWrapper';
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
