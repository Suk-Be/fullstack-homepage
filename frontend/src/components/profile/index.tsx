import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { LogoClaim, LogoHP, ParagraphHP } from '../TextElements';
import ProfilePic from './ProfilePicture';

export default function ProfileHP() {
    const section = {
        padding: '2rem',
        marginRight: '2rem',
        background: 'rgb(33,29,29)',
        textAlign: 'center',
    };

    const section2 = {
        maxWidth: 'calc(100%-2rem)',
        margin: '0 auto',
        padding: '2rem',
        marginRight: '2rem',
        position: 'relative',
        background: 'rgb(33,29,29)',
        textAlign: 'left',
    };

    return (
        <>
            <Box component="section" sx={section}>
                <LogoHP />
                <LogoClaim />
                <ProfilePic />
            </Box>
            <Box sx={section2}>
                <Box
                    sx={{
                        color: 'rgb(33,29,29)',
                        fontFamily: 'Fira Sans',
                        fontWeight: 400,
                        fontSize: '1rem',
                        fontStyle: 'normal',
                        background: 'rgb(56,255,148)',
                        position: 'absolute',
                        inset: '0 calc(-1*2rem) auto auto',
                        padding: '20px 20px 30px 2rem',
                        clipPath: `polygon(0 0, 100% 0, 100% calc(100% - 10px), 
                                  calc(100% - 2rem) 100%, 
                                  calc(100% - 2rem) calc(100% - 10px), 
                                  0 calc(100% - 10px), 
                                  0px calc(50% - 10px/2))`,
                        boxShadow: '0 calc(-1*10px) 0 inset #0005',
                        width: 'calc(100% + 2rem)',
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            color: 'rgb(33,29,29)',
                            fontFamily: 'Fira Sans',
                            fontWeight: 600,
                            fontSize: '1.3rem',
                            fontStyle: 'normal',
                            position: 'relative',
                        }}
                    >
                        Das fehlende Puzzlestück
                    </Typography>
                </Box>
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

                <ParagraphHP marginBottom="2rem">
                    Für Entwickler/innen stehe ich gerne für Frontend Fragen zur Verfügung. Dazu
                    gehören klassischerweise Schätzungen zur Komplexität und mögliche Dauern - und
                    die gemeinsame Gestaltung von REST Schnittstellen.
                </ParagraphHP>
            </Box>
            <Box component="section" sx={section}></Box>
        </>
    );
}
