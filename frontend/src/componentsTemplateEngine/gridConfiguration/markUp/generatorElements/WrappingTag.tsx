import { toTextClosingTagFrom, toTextOpeningTagFrom } from '@/utils/templateEngine/parseHtmlToText';
import { FC, JSXElementConstructor, ReactElement, ReactNode } from 'react';

type WrappingTagProps = {
    isOpeningTag?: boolean;
    isClosingTag?: boolean;
    Component: ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode>;
};

const WrappingTag: FC<WrappingTagProps> = ({
    isOpeningTag = false,
    isClosingTag = false,
    Component,
}) => {
    const styleSpacingAroundCodeTop = "block pb-4"
    const styleSpacingAroundCodeBottom = "block pt-4"

    const Tag = () => {
        if (isOpeningTag) {
            return <code className={styleSpacingAroundCodeTop}>
              {toTextOpeningTagFrom(Component)}
            </code>;
        }
        if (isClosingTag) {
            return <code className={styleSpacingAroundCodeBottom}>
              {toTextClosingTagFrom(Component)}
            </code>;
        }
    };

    return <Tag />;
};

export default WrappingTag;
