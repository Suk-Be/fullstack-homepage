import {
    createHtmlAsTextFromPassedComponent,
    parseStringToADomModel,
} from '@/utils/templateEngine/parseHtmlToText/index';
import {
    ComponentPropsWithoutRef,
    FC,
    JSXElementConstructor,
    ReactElement,
    ReactNode,
} from 'react';
import ChildrenTags from '../generatorElements/ChildrenTags';
import ParentTag from '../generatorElements/ParentTag';
import OpeningTagWithTranspiledTailwindClasses from './OpeningTagWithTranspiledTailwindClasses';
import { testId } from '@/utils/testId';

interface LayoutDivProps extends ComponentPropsWithoutRef<'div'> {
    Component: ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode>;
}

const CreateGridMarkup: FC<LayoutDivProps> = ({ Component }) => {
    const domDynamicGrid = parseStringToADomModel(createHtmlAsTextFromPassedComponent(Component))
        .body.firstChild?.childNodes;

    const createInnerHtmlElements = Array.from(domDynamicGrid ?? []).map((elem) => {
        let div = document.createElement('div');
        div.appendChild(elem);
        return div?.innerHTML;
    });

    const ClosingTag = () => <ParentTag isClosingTag={true} Component={Component} />;

    return (
        <div className="grid grid-cols-1 p-4">
            <div
                className="bg-gray-dark text-green p-6 rounded-xl"
                {...testId('dynamic-grid-markup')}
            >
                <OpeningTagWithTranspiledTailwindClasses
                    isDynamicInlineStyle={true}
                    Component={Component}
                />
                <ChildrenTags arr={createInnerHtmlElements} />
                <ClosingTag />
            </div>
        </div>
    );
};

export default CreateGridMarkup;
