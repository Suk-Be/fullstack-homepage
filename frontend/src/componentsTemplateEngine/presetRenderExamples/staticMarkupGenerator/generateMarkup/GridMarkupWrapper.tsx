import ChildrenTags from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/ChildrenTags'; // Adjust path as needed
import {
    ClosingTag,
    OpeningTag,
} from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/WrappingTag'; // Adjust path as needed
import { FC, JSXElementConstructor, ReactElement } from 'react';
import { twMerge } from 'tailwind-merge'; // Assuming you have twMerge

type MarkupComponent = ReactElement<any, string | JSXElementConstructor<any>>;

interface GridMarkupWrapperProps {
    markupComponent: MarkupComponent;
    childrenTagsArr: string[];
    className?: string;
}

const GridMarkupWrapper: FC<GridMarkupWrapperProps> = ({
    markupComponent,
    childrenTagsArr,
    className,
}) => {
    return (
        <div className={twMerge('grid grid-cols-1 p-4', className)}>
            <div className="bg-gray-dark text-green p-6 rounded-xl">
                <OpeningTag component={markupComponent} />
                <ChildrenTags arr={childrenTagsArr} />
                <ClosingTag component={markupComponent} />
            </div>
        </div>
    );
};

export default GridMarkupWrapper;
