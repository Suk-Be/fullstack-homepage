import ColumnsSpanningGrid from '../../../componentsTemplateEngine/gridLayout/layoutPresets/ColspanningGrid';
import ChildrenTags from '../../../componentsTemplateEngine/gridLayout/markUpElements/ChildrenTags';
import ParentTag from '../../../componentsTemplateEngine/gridLayout/markUpElements/ParentTag';
import colSpanningGridTagsToText from '../../../utils/templateEngine/parseHtmlToText/colSpanningGridTagsToText';
import { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from 'tailwind-merge';

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
