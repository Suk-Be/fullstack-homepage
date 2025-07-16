import RowspanningGrid from '../../../componentsTemplateEngine/gridLayout/layoutPresets/RowspanningGrid';
import ChildrenTags from '../../../componentsTemplateEngine/gridLayout/markUpElements/ChildrenTags';
import ParentTag from '../../../componentsTemplateEngine/gridLayout/markUpElements/ParentTag';
import rowSpanningGridTagsToText from '../../../utils/templateEngine/parseHtmlToText/rowSpanningGridTagsToText';
import { ComponentPropsWithoutRef, FC } from 'react';

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
