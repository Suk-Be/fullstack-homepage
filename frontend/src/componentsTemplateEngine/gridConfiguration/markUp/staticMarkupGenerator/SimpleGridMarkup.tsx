import SimpleGrid from '@/componentsTemplateEngine/presetRenderExamples/SimpleGrid';
import simpleGridChildrenTagsToText from '@/utils/templateEngine/parseHtmlToText/simpleGridChildrenTagsToText';
import { ComponentPropsWithoutRef, FC } from 'react';
import GridMarkupWrapper from '../generatorElements/GridMarkupWrapper';

interface SimpleGridMarkupProps extends ComponentPropsWithoutRef<'div'> {
    layoutGapConfig: 'gap-2' | 'gap-4';
}

const SimpleGridMarkup: FC<SimpleGridMarkupProps> = ({ layoutGapConfig }) => {
    return (
        <GridMarkupWrapper
            markupComponent={<SimpleGrid layoutGapConfig={layoutGapConfig} />}
            childrenTagsArr={simpleGridChildrenTagsToText}
        />
    );
};

export default SimpleGridMarkup;
