import RowspanningGrid from '@/componentsTemplateEngine/presetRenderExamples/RowspanningGrid';
import rowSpanningGridTagsToText from '@/utils/templateEngine/parseHtmlToText/rowSpanningGridTagsToText';
import { ComponentPropsWithoutRef, FC } from 'react';
import ChildrenTags from './ChildrenTags';
import ParentTag from './ParentTag';

const RowspanningGridMarkup: FC<ComponentPropsWithoutRef<'div'>> = () => {
    return (
        <div className="grid grid-cols-1 p-4">
            <div className="bg-gray-dark text-green p-6 rounded-xl">
                <ParentTag isOpeningTag={true} Component={<RowspanningGrid />} />
                <ChildrenTags arr={rowSpanningGridTagsToText} />
                <ParentTag isClosingTag={true} Component={<RowspanningGrid />} />
            </div>
        </div>
    );
};

export default RowspanningGridMarkup;
