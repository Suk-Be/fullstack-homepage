import RegisterButtonSocialite from '@/components/auth/shared-components/RegisterButtonSocialite';
import { Card, SignInContainer as SignUpContainer } from '@/components/ContainerElements';
import RouterLinkWrapper from '@/components/RouterLink';
import { GithubIcon } from '@/components/shared-components/CustomIcons';
import { HeadlineSignInUp as Headline, ParagraphHP } from '@/components/TextElements';
import { testId } from '@/utils/testId';
import { ArrowCircleDown, ArrowCircleUp } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Link as MuiLink } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function AccordionExpandIcon() {
    return (
        <SignUpContainer direction="column" justifyContent="space-between" {...testId('accordion')}>
            <Card variant="outlined">
                <Accordion>
                    <AccordionSummary
                        expandIcon={
                            <ArrowCircleDown
                                sx={{ color: (theme) => alpha(theme.palette.grey[900], 0.7) }}
                            />
                        }
                        aria-controls="panel1-content"
                        id="panel1-header"
                        {...testId('accordion-projekte')}
                    >
                        <Headline>Projekt</Headline>
                    </AccordionSummary>
                    <AccordionDetails {...testId('accordion-projekte-content')}>
                        <ParagraphHP>
                            <em>MVP Oktober 2025:</em> <br />
                            Es gibt einen MVP für die Template Engine, die es erlaubt eingeloggten
                            Usern mit Hilfe von Schiebereglern Layout Grids zu erstellen und für
                            jedes Layout auch einen HTML Code zu erzeugen.
                        </ParagraphHP>
                        <ParagraphHP>
                            User können beliebig viele Layouts speichern: <br />
                            Eindeutigkeit. Die gespeicherten Layouts brauchen eindeutige Namen und
                            Layout Einstellungen. Doppelte Einträge sind nicht erlaubt. <br />
                            Gespeicherte Layouts sind wieder löschbar.
                        </ParagraphHP>
                        <ParagraphHP>
                            Sortierung: <br />
                            Die Layouts werden nach neuestem Datum sortiert. Das Datum wird
                            angezeigt mit today, yesterday und dd.mm.yyyy.
                        </ParagraphHP>
                        <ParagraphHP>
                            Authentifizierung: <br />
                            User dürfen nur ihre eigenen Layouts erstellen, einsehen, bearbeiten und
                            löschen.
                        </ParagraphHP>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={
                            <ArrowCircleUp
                                sx={{ color: (theme) => alpha(theme.palette.grey[900], 0.7) }}
                            />
                        }
                        aria-controls="panel2-content"
                        id="panel2-header"
                        {...testId('accordion-template-engine')}
                    >
                        <Headline>Template Engine</Headline>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ParagraphHP>
                            Die Template Engine nutzt ein php backend mit controllern, sql, policies
                            und provided eine RestApi Schnittstelle.
                        </ParagraphHP>
                        <ParagraphHP>
                            Das Frontend ist mit TypeScript und CSS als Single Page App umgesetzt.
                        </ParagraphHP>
                        <ParagraphHP>
                            <MuiLink
                                component={RouterLinkWrapper}
                                href="/template-engine"
                                color="rgba(53,102,64, 1)"
                            >
                                zum MVP
                            </MuiLink>
                        </ParagraphHP>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={
                            <ArrowCircleUp
                                sx={{ color: (theme) => alpha(theme.palette.grey[900], 0.7) }}
                            />
                        }
                        aria-controls="panel2-content"
                        id="panel2-header"
                        {...testId('accordion-code-repository')}
                    >
                        <Headline {...testId('headline-accordion')}>Code Repository</Headline>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ParagraphHP>
                            Der Code für diese App ist in einem Code Repository hinterlegt. Es gibt
                            für Interessierte zusätzliche README im Frontend und Backend
                            Verzeichnis. Dort gibt es Informationen zum Tech-Stack, Schnellstart,
                            Projektstruktur und Testing.
                        </ParagraphHP>
                        <ParagraphHP>
                            Das <b>Backend</b> ist in PHP geschrieben und nutzt das Laravel
                            Framework mit Sanctum SPA für Authentication Services und Policies für
                            Authorization. Unit/Integrations Tests sind mit Pest geschrieben.
                        </ParagraphHP>
                        <ParagraphHP>
                            Das <b>Frontend</b> ist in TypeScript geschrieben. Genutzte Frameworks
                            sind react, redux toolkit, react-router und axios. Für die
                            Unit/Integration Tests nutze ich vitest, rtl und msw.
                        </ParagraphHP>
                        <ParagraphHP>
                            FYI: <br />
                            Das Design der Home Page nutzt ich Material UI Komponenten, theme und
                            CSS. <br />
                            Das Design der Template Engine nutzt Engine headlessui Komponenten und
                            tailwindcss.
                        </ParagraphHP>

                        <ParagraphHP sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <RegisterButtonSocialite
                                startIcon={<GithubIcon />}
                                text="zum Repository"
                                testIdIdentifier="form-button-login-with-github"
                                clickHandler={() =>
                                    window.open(
                                        'https://github.com/Suk-Be/fullstack-homepage',
                                        '_blank',
                                    )
                                }
                            />
                        </ParagraphHP>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </SignUpContainer>
    );
}
