import { componentToHtmlText, toDomModel } from '@/utils/templateEngine/parseHtmlToText/index';
import {
    ComponentPropsWithoutRef,
    FC,
    JSXElementConstructor,
    ReactElement,
    ReactNode,
} from 'react';
import ChildrenTags from '../generatorElements/ChildrenTags';
import ParentTag from '../generatorElements/ParentTag';
import DivWithTranspiledTailwindClasses from './DynamicInlineStyle';

interface DynamicGridMarkupProps extends ComponentPropsWithoutRef<'div'> {
    Component: ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode>;
}

const DynamicGridMarkup: FC<DynamicGridMarkupProps> = ({ Component }) => {
    const domDynamicGrid = toDomModel(componentToHtmlText(Component)).body.firstChild?.childNodes;

    const dynamicGridChildrenTagsToText = Array.from(domDynamicGrid ?? []).map((elem) => {
        let tmp = document.createElement('div');
        tmp.appendChild(elem);
        return tmp?.innerHTML;
    });

    return (
        <div className="grid grid-cols-1 p-4">
            <div
                className="bg-gray-dark text-green p-6 rounded-xl"
                data-testid="dynamic-grid-markup"
            >
                <DivWithTranspiledTailwindClasses
                    isDynamicInlineStyle={true}
                    Component={Component}
                />
                <ChildrenTags arr={dynamicGridChildrenTagsToText} />
                <ParentTag isClosingTag={true} Component={Component} />
            </div>
        </div>
    );
};

export default DynamicGridMarkup;
