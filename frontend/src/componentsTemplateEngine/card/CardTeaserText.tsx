import { FC, PropsWithChildren } from 'react';
import CardHeadline from '../../componentsTemplateEngine/card/CardHeadline';
import { ArrowLink } from '../svgs/index';

interface ContentProps {
    headline: string;
    text: string;
}
interface CardTeaserTextProps extends ContentProps {
    isBigCard: boolean;
}

const Content: FC<PropsWithChildren<ContentProps>> = ({ headline, text, children }) => {
    return (
        <>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#38ff94] sm:size-16 mt-6">
                {children}
            </div>

            <div className="pt-3 sm:pt-5">
                <CardHeadline>{headline}</CardHeadline>

                <p className="mt-4 text-sm/relaxed">{text}</p>
            </div>
        </>
    );
};

const CardTeaserText: FC<PropsWithChildren<CardTeaserTextProps>> = ({
    headline,
    text,
    isBigCard,
    children,
}) => {
    if (isBigCard) {
        return (
            <div className="relative flex items-center gap-6 lg:items-end">
                <div id="docs-card-content" className="flex items-start gap-3 lg:flex-col">
                    <Content headline={headline} text={text}>
                        {children}
                    </Content>
                </div>
                <ArrowLink />
            </div>
        );
    }
    return (
        <div className="relative flex items-top gap-6">
            <Content headline={headline} text={text}>
                {children}
            </Content>
            <ArrowLink />
        </div>
    );
};

export default CardTeaserText;
