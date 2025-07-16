import CardTeasers from '../../componentsTemplateEngine/card/CardTeasers';
import CardTeasersWithRTE from '../../componentsTemplateEngine/card/CardTeaserWithRTE';
import type { Teaser, Welcome } from '../../types/templateEngine';
import { FC } from 'react';

export const AllTeasers: FC<{ data: Welcome }> = ({ data }) => {
    const allTeasers = data.data;
    const teasers: Teaser[] = allTeasers.filter((teaser) => teaser.type === 'Teaser');
    const teasersrWithRTE: Teaser[] = allTeasers.filter(
        (teaser) => teaser.type === 'TeaserWithLinks',
    );

    return (
        <>
            <CardTeasers teasers={teasers} />
            <CardTeasersWithRTE teasersWithRTE={teasersrWithRTE} />
        </>
    );
};

export default AllTeasers;
