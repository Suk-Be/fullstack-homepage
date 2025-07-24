import SimpleGrid from '@/componentsTemplateEngine/presetRenderExamples/SimpleGrid';
import simpleGridChildrenTagsToText from '@/utils/templateEngine/parseHtmlToText/simpleGridChildrenTagsToText';
import { ComponentPropsWithoutRef, FC } from 'react';
import ChildrenTags from '../generatorElements/ChildrenTags';
import ParentTag from '../generatorElements/ParentTag';

interface SimpleGridMarkupProps extends ComponentPropsWithoutRef<'div'> {
    hasGap: 'gap-2' | 'gap-4';
}

const SimpleGridMarkup: FC<SimpleGridMarkupProps> = ({ hasGap }) => {
    return (
        <div className="grid grid-cols-1 p-4">
            <div className="bg-gray-dark text-green p-6 rounded-xl">
                <ParentTag isOpeningTag={true} Component={<SimpleGrid className={hasGap} />} />
                <ChildrenTags arr={simpleGridChildrenTagsToText} />
                <ParentTag isClosingTag={true} Component={<SimpleGrid className={hasGap} />} />
            </div>
        </div>
    );
};

export default SimpleGridMarkup;
