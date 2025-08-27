import { toTextClosingTagFrom, toTextOpeningTagFrom } from '@/utils/templateEngine/parseHtmlToText';
import { testId } from '@/utils/testId';
import { FC, JSXElementConstructor, ReactElement, ReactNode } from 'react';

type ComponentProps =
    | ReactElement<unknown, string | JSXElementConstructor<any>>
    | Iterable<ReactNode>;

type WrappingTagProps = {
    isOpeningTag?: boolean;
    isClosingTag?: boolean;
    component: ComponentProps;
};

const WrappingTag: FC<WrappingTagProps> = ({
    isOpeningTag = false,
    isClosingTag = false,
    component,
}) => {
    const styleSpacingAroundCodeTop = 'block pb-4';
    const styleSpacingAroundCodeBottom = 'block pt-4';

    const Tag = () => {
        if (isOpeningTag) {
            return (
                <code className={styleSpacingAroundCodeTop} {...testId('opening-tag')}>
                    {toTextOpeningTagFrom(component)}
                </code>
            );
        }
        if (isClosingTag) {
            return (
                <code className={styleSpacingAroundCodeBottom} {...testId('closing-tag')}>
                    {toTextClosingTagFrom(component)}
                </code>
            );
        }
        return null;
    };

    return <Tag />;
};

const OpeningTag: FC<{ component: ComponentProps }> = ({ component }) => (
    <WrappingTag isOpeningTag={true} component={component} />
);
const ClosingTag: FC<{ component: ComponentProps }> = ({ component }) => (
    <WrappingTag isClosingTag={true} component={component} />
);

export { ClosingTag, OpeningTag, WrappingTag };
