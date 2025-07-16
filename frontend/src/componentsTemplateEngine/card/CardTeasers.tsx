import CardContainerLink from '../../componentsTemplateEngine/card/CardContainerLink';
import CardTeaserImage from '../../componentsTemplateEngine/card/CardTeaserImage';
import CardTeaserText from '../../componentsTemplateEngine/card/CardTeaserText';
import { CommerceSVG, LayoutsSVG, MapsSVG, MissingPieceSVG } from '../svgs';
import type { Teaser } from '../../types/templateEngine';
import { FC } from 'react';

export const CardTeasers: FC<{ teasers: Teaser[] }> = ({ teasers }) => {
    const hasTeaserImage = (hasImage: boolean, altTag: string) =>
        hasImage ? <CardTeaserImage alt={altTag} /> : null;

    const Icon = (teaserId: number) => {
        return teaserId === 1 ? (
            <MissingPieceSVG />
        ) : teaserId === 2 ? (
            <LayoutsSVG />
        ) : teaserId === 3 ? (
            <CommerceSVG />
        ) : teaserId === 4 ? (
            <MapsSVG />
        ) : null;
    };

    const Teasers = teasers.map((teaser) => {
        return (
            <CardContainerLink
                id={teaser.id.toString()}
                key={teaser.id}
                href={teaser.link}
                dataImage={teaser.attributes.isBigCard}
                ariaLabel={teaser.attributes.title}
            >
                {hasTeaserImage(teaser.attributes.isBigCard, teaser.attributes.title)}

                <CardTeaserText
                    isBigCard={teaser.attributes.isBigCard}
                    headline={teaser.attributes.title}
                    text={teaser.attributes.description}
                >
                    {Icon(teaser.id)}
                </CardTeaserText>
            </CardContainerLink>
        );
    });

    return <>{Teasers}</>;
};

export default CardTeasers;
