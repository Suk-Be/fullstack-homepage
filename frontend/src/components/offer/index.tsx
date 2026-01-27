import { Section } from '@/components/ContainerElements';
import { HeadlineHP, ParagraphHP, SubTitle } from '@/components/TextElements';
import { testId } from '@/utils/testId';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import NumberedList from './List';

interface Props {
    offer: [
        {
            id: number;
            type: 'offer';
            attributes: {
                title: string;
                description: string;
            };
        },
    ];
    teaser: {
        id: number;
        type: 'teaser';
        attributes: {
            title: string;
            subtitle?: string;
            list: [
                {
                    number: number;
                    text: string;
                },
            ];
        };
    };
}

const OfferHP = ({ offer, teaser }: Props) => {
    const sanitizedData0 = DOMPurify.sanitize(offer[0].attributes.description);
    /* @ts-expect-error dom string purified */
    const sanitizedData1 = DOMPurify.sanitize(offer[1].attributes.description);
    /* @ts-expect-error dom string purified */
    const sanitizedData2 = DOMPurify.sanitize(offer[2].attributes.description);
    return (
        <>
            <Section
                textAlign="center"
                padding="2rem 0 0.5rem 2rem"
                paddingTop="2rem"
                paddingTopMd="7rem"
            >
                <HeadlineHP variant="h3" component="h3" marginBottom="0.3rem">
                    {teaser.attributes.title}
                </HeadlineHP>
                <SubTitle>{teaser.attributes.subtitle}</SubTitle>
                <NumberedList list={teaser.attributes.list} />
            </Section>
            <Section textAlign="left" padding="0rem 2rem 2rem 4rem" {...testId('offer-content-01')}>
                <HeadlineHP
                    variant="h4"
                    component="h4"
                    marginBottom="1rem"
                    textAlign="left"
                    {...testId('offer-headline-01')}
                >
                    {offer[0].attributes.title}
                </HeadlineHP>

                <ParagraphHP {...testId('offer-content-01')}>{parse(sanitizedData0)}</ParagraphHP>
            </Section>

            <Section textAlign="left" padding="0rem 2rem 2rem 4rem">
                <HeadlineHP
                    variant="h5"
                    component="h5"
                    marginBottom="1rem"
                    color="colorSecondary"
                    {...testId('offer-headline-02')}
                >
                    {/* @ts-expect-error possibly undefined */}
                    {offer[1].attributes.title!}
                </HeadlineHP>
                <ParagraphHP {...testId('offer-content-02')}>{parse(sanitizedData1)}</ParagraphHP>
            </Section>

            <Section textAlign="left" padding="0rem 2rem 2rem 4rem">
                <HeadlineHP
                    variant="h4"
                    component="h4"
                    marginBottom="1rem"
                    textAlign="left"
                    {...testId('offer-headline-03')}
                >
                    {/* @ts-expect-error possibly undefined */}
                    {offer[2].attributes.title}
                </HeadlineHP>

                <ParagraphHP {...testId('offer-content-03')}>{parse(sanitizedData2)}</ParagraphHP>
            </Section>
        </>
    );
};

export default OfferHP;
