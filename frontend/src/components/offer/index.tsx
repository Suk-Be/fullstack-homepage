import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { testId } from '../../utils/testId';
import { Section } from '../ContainerElements';
import { HeadlineHP, ParagraphHP, SubTitle } from '../TextElements';
import NumberedList from './List';

type Props = {
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
};

const OfferHP = ({ offer, teaser }: Props) => {
    const sanitizedData0 = DOMPurify.sanitize(offer[0].attributes.description);
    /* @ts-ignore*/
    const sanitizedData1 = DOMPurify.sanitize(offer[1].attributes.description);
    return (
        <>
            <Section
                textAlign="center"
                background="rgba(255,255,255, 1)"
                color="rgba(33,29,29, 1)"
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
            <Section
                textAlign="left"
                background="rgba(255,255,255, 1)"
                color="rgba(33,29,29, 1)"
                padding="0rem 2rem 2rem 4rem"
                data-testid="offer-content-01"
            >
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

            <Section
                textAlign="left"
                background="rgba(255,255,255, 1)"
                color="rgba(33,29,29, 1)"
                padding="0rem 2rem 2rem 4rem"
                marginBottom="2rem"
            >
                <HeadlineHP
                    variant="h5"
                    component="h5"
                    marginBottom="1rem"
                    color="rgba(53,102,64, 1)"
                    {...testId('offer-headline-02')}
                >
                    {/* @ts-ignore*/}
                    {offer[1].attributes.title!}
                </HeadlineHP>
                <ParagraphHP {...testId('offer-content-02')}>{parse(sanitizedData1)}</ParagraphHP>
            </Section>
        </>
    );
};

export default OfferHP;
