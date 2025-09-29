import ChildrenTags from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/ChildrenTags';
import { ClosingTag } from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/WrappingTag';
import {
    createHtmlAsTextFromPassedComponent,
    parseStringToADomModel,
} from '@/utils/templateEngine/parseHtmlToText/index';
import { testId } from '@/utils/testId';
import {
    ComponentPropsWithoutRef,
    FC,
    JSXElementConstructor,
    ReactElement,
    ReactNode,
} from 'react';
import OpeningTagWithTranspiledTailwindClasses from './OpeningTagWithTranspiledTailwindClasses';

interface LayoutDivProps extends ComponentPropsWithoutRef<'div'> {
    Component: ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode>;
}

const CreateGridMarkup: FC<LayoutDivProps> = ({ Component }) => {
    const domDynamicGrid = parseStringToADomModel(createHtmlAsTextFromPassedComponent(Component))
        .body.firstChild?.childNodes;

    const createInnerHtmlElements = Array.from(domDynamicGrid ?? []).map((elem) => {
        const div = document.createElement('div');
        div.appendChild(elem);
        return div?.innerHTML;
    });

    return (
        <div className="grid grid-cols-1 p-4">
            <div
                className="bg-gray-dark text-green p-6 rounded-xl"
                {...testId('create-grid-markup')}
            >
                <OpeningTagWithTranspiledTailwindClasses
                    isDynamicInlineStyle={true}
                    Component={Component}
                />
                <ChildrenTags arr={createInnerHtmlElements} />
                <ClosingTag component={Component} />
            </div>
        </div>
    );
};

export default CreateGridMarkup;
