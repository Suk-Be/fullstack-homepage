import { toTextClosingTagFrom, toTextOpeningTagFrom } from '@/utils/templateEngine/parseHtmlToText';
import { FC, JSXElementConstructor, ReactElement, ReactNode } from 'react';

type ParentTagProps = {
    isOpeningTag?: boolean;
    isClosingTag?: boolean;
    Component: ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode>;
};

const ParentTag: FC<ParentTagProps> = ({
    isOpeningTag = false,
    isClosingTag = false,
    Component,
}) => {
    const Tag = () => {
        if (isOpeningTag) {
            return <code className="block pb-4">{toTextOpeningTagFrom(Component)}</code>;
        }
        if (isClosingTag) {
            return <code className="block pt-4">{toTextClosingTagFrom(Component)}</code>;
        }
    };

    return <Tag />;
};

export default ParentTag;
