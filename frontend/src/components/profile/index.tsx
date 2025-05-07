import { SectionHP, SectionHPRelative } from '../ContainerElements';
import { Claim, LogoHP, ParagraphHP } from '../TextElements';
import ProfilePic from './ProfilePicture';
import RibbonLayout from './Ribbon';

export default function ProfileHP() {
    return (
        <>
            <SectionHP textAlign="center">
                <LogoHP component="h1" />
                <Claim>(Web Developer)</Claim>
                <ProfilePic />
            </SectionHP>
            <SectionHPRelative>
                <RibbonLayout variant="h2" component="h2" />
                <ParagraphHP marginTop="3rem">
                    Als Frontend Entwickler sehe ich mich in einer unterstützenden Rolle für das
                    Team.
                </ParagraphHP>
                <ParagraphHP>
                    Wenn Kollegen und Kolleginnen den Arbeitsalltag erleichtern kann, dann ist das
                    auch für mich ein Erfolg.
                </ParagraphHP>
                <ParagraphHP>
                    Als Frontend Entwickler berate und konzipiere ich gerne in Planungsrunden mit
                    und programmiere selbständig in SCRUM Sprints.
                </ParagraphHP>

                <ParagraphHP>
                    Für Product Owner kann ich figma Designs auf technische und inhaltliche Qualität
                    prüfen (Gibt es Lücken im Styleguide? Sind eventuell States unvollständig?)
                </ParagraphHP>

                <ParagraphHP>
                    Für Entwickler/innen stehe ich gerne für Frontend Fragen zur Verfügung. Dazu
                    gehören klassischerweise Schätzungen zur Komplexität und mögliche Dauern - und
                    die gemeinsame Gestaltung von REST Schnittstellen.
                </ParagraphHP>
            </SectionHPRelative>
        </>
    );
}
