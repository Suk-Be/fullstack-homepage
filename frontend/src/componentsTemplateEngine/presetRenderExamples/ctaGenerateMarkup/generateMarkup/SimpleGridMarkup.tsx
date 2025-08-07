import SimpleGrid from '@/componentsTemplateEngine/presetRenderExamples/grids/SimpleGrid';
import simpleGridItemTagsToText from '@/utils/templateEngine/parseHtmlToText/simpleGridItemTagsToText';
import { ComponentPropsWithoutRef, FC } from 'react';
import GridMarkupWrapper from './GridMarkupWrapper';

interface SimpleGridMarkupProps extends ComponentPropsWithoutRef<'div'> {
    layoutGapConfig: 'gap-2' | 'gap-4';
}

const SimpleGridMarkup: FC<SimpleGridMarkupProps> = ({ layoutGapConfig }) => {
    return (
        <GridMarkupWrapper
            markupComponent={<SimpleGrid layoutGapConfig={layoutGapConfig} />}
            childrenTagsArr={simpleGridItemTagsToText}
        />
    );
};

export default SimpleGridMarkup;
