import ColumnsSpanningGrid from '@/componentsTemplateEngine/presetRenderExamples/ColspanningGrid';
import colSpanningGridTagsToText from '@/utils/templateEngine/parseHtmlToText/colSpanningGridTagsToText';
import { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from 'tailwind-merge';
import ChildrenTags from '../generatorElements/ChildrenTags';
import ParentTag from '../generatorElements/ParentTag';

interface ColspanningGridMarkupProps extends ComponentPropsWithoutRef<'div'> {
    hasCol: 'col-span-2';
}

const ColspanningGridMarkup: FC<ColspanningGridMarkupProps> = ({ hasCol, className }) => {
    return (
        <div className={twMerge('grid grid-cols-1 p-4', className)}>
            <div className="bg-gray-dark text-green p-6 rounded-xl">
                <ParentTag
                    isOpeningTag={true}
                    Component={<ColumnsSpanningGrid className={hasCol} />}
                />
                <ChildrenTags arr={colSpanningGridTagsToText} />
                <ParentTag
                    isClosingTag={true}
                    Component={<ColumnsSpanningGrid className={hasCol} />}
                />
            </div>
        </div>
    );
};

export default ColspanningGridMarkup;
