import ColumnsSpanningGrid from '@/componentsTemplateEngine/presetRenderExamples/ColspanningGrid';
import colSpanningGridTagsToText from '@/utils/templateEngine/parseHtmlToText/colSpanningGridTagsToText';
import { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from 'tailwind-merge';
import GridMarkupWrapper from '../generatorElements/GridMarkupWrapper';

interface ColspanningGridMarkupProps extends ComponentPropsWithoutRef<'div'> {
    hasCol: 'col-span-2';
}

const ColspanningGridMarkup: FC<ColspanningGridMarkupProps> = ({ hasCol, className }) => {
    return (
        <GridMarkupWrapper
            markupComponent={<ColumnsSpanningGrid className={hasCol} />}
            childrenTagsArr={colSpanningGridTagsToText}
            className={twMerge(className)} // Pass the className to the wrapper
        />
    );
};

export default ColspanningGridMarkup;
