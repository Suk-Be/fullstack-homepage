import ColumnsSpanningGrid from '@/componentsTemplateEngine/presetRenderExamples/grids/ColspanningGrid';
import colSpanningGridTagsToText from '@/utils/templateEngine/parseHtmlToText/colSpanningGridTagsToText';
import { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from 'tailwind-merge';
import GridMarkupWrapper from './GridMarkupWrapper';

interface ColspanningGridMarkupProps extends ComponentPropsWithoutRef<'div'> {
    layoutConfig: 'col-span-2';
}

const ColspanningGridMarkup: FC<ColspanningGridMarkupProps> = ({ layoutConfig, className }) => {
    return (
        <GridMarkupWrapper
            markupComponent={<ColumnsSpanningGrid layoutConfig={layoutConfig} />}
            childrenTagsArr={colSpanningGridTagsToText}
            className={twMerge(className)} // Pass the className to the wrapper
        />
    );
};

export default ColspanningGridMarkup;
