import { CardContainerDiv } from '../../componentsTemplateEngine/card/CardContainerLink';
import CardHeadline from '../../componentsTemplateEngine/card/CardHeadline';
import { MapsSVG } from '../svgs';
import type { Teaser } from '../../types/templateEngine';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { FC } from 'react';

export const CardTeasersWithRTE: FC<{ teasersWithRTE: Teaser[] }> = ({ teasersWithRTE }) => {
    const TeasersRTE = teasersWithRTE.map((teaser: Teaser) => {
        // Teaser makes use of rich text editor html elements
        // data.type === 'TeaserWithLinks' description property has a list of links
        const sanitizedData = DOMPurify.sanitize(teaser.attributes.description);
        return (
            <CardContainerDiv id={teaser.id.toString()} key={teaser.id}>
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#38ff94] sm:size-16 mt-6">
                    <MapsSVG />
                </div>

                <div className="pt-3 sm:pt-5">
                    <CardHeadline>{teaser.attributes.title}</CardHeadline>
                    <p className="mt-4 text-sm/relaxed">{parse(sanitizedData)}</p>
                </div>
            </CardContainerDiv>
        );
    });

    return <>{TeasersRTE}</>;
};

export default CardTeasersWithRTE;
