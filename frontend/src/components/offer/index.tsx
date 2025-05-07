import { SectionHP } from '../ContainerElements';
import { Claim, HeadlineHP, ParagraphHP } from '../TextElements';
import NumberedList from './List';

const OfferHP = () => {
    return (
        <>
            <SectionHP
                textAlign="center"
                background="rgba(255,255,255, 1)"
                color="rgba(33,29,29, 1)"
                padding="2.5rem 0 2rem 2rem"
            >
                <HeadlineHP variant="h3" component="h3" marginBottom="0.3rem">
                    FRONTEND / DESIGN
                </HeadlineHP>
                <Claim fontSize="1.3rem" color="rgba(33,29,29, 0.5)">
                    Konzeption und Weiterentwicklung
                </Claim>
                <NumberedList />
            </SectionHP>
            <SectionHP
                textAlign="left"
                background="rgba(255,255,255, 1)"
                color="rgba(33,29,29, 1)"
                padding="0rem 2rem 2rem 4rem"
            >
                <HeadlineHP
                    variant="h4"
                    component="h4"
                    marginBottom="1rem"
                    fontWeight={300}
                    textAlign="left"
                >
                    FRONTENDENTWICKLUNG
                </HeadlineHP>
                <ParagraphHP>
                    Moderne JavaScript basierte Single Page Applications, klassische Server Side
                    Rendered Applications, Hybride Page Applications haben allesamt ihre
                    Daseinsberechtigung.
                </ParagraphHP>
                <ParagraphHP>
                    Gerne berate ich Sie kontinuierlich bei der Anpassung der Frontend Architektur
                    oder bei der Wahl einer geeigneten Architektur, die zu Ihrem Team und Ihrem
                    Service passt.
                </ParagraphHP>
                <ParagraphHP>
                    Alter Code! Kein Problem, Sie haben die Tickets, ich transformiere oder
                    insoliere alten Code.
                </ParagraphHP>
                <ParagraphHP>
                    Seit 9 Jahren arbeite ich mit git und mit unterschiedlich großen Repositories.
                    Sie können davon ausgehen, dass ich sorgsam mit dem bereits implementierten Code
                    umgehe, ob im mono oder verteilten Repo.
                </ParagraphHP>
            </SectionHP>

            <SectionHP
                textAlign="left"
                background="rgba(255,255,255, 1)"
                color="rgba(33,29,29, 1)"
                padding="0rem 2rem 2rem 4rem"
            >
                <HeadlineHP
                    variant="h4"
                    component="h4"
                    marginBottom="1rem"
                    fontWeight={300}
                    color="rgba(53,102,64, 1)"
                >
                    DESIGN
                </HeadlineHP>
                <ParagraphHP>
                    Als Web Design Ansatz verfolge ich die „form follows function“ Prinzipien der
                    Architektur und industrieller Produkte.
                </ParagraphHP>
                <ParagraphHP>
                    Schriften, Farben und Proportionen in Layouts setze ich ein, um die
                    Wiedererkennbarkeit deutlich zu machen. Mir ist es wichtig, dass Marke, Produkt
                    und Nutzbarkeit / Funktionalität einer Anwendung im Gedächtnis bleiben.
                </ParagraphHP>
                <ParagraphHP>
                    Wenn Sie Mockups, Layouts, Widgets oder Styleguides für Corporate Designs
                    benötigen, kann ich diese auch erstellen.
                </ParagraphHP>
            </SectionHP>
        </>
    );
};

export default OfferHP;
