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
                            <em>Relaunch der Homepage</em> <br />
                            Die bestehende Website aus dem Jahr 2014 war dringend
                            überarbeitungsbedürftig. Sie basierte auf veralteten Technologien wie
                            jQuery und präsentierte überwiegend grafische Arbeiten in einem Slider.
                            Da ich seit 2014 hauptsächlich als Entwickler arbeite, war ein
                            inhaltliches und technisches Update längst überfällig.
                        </ParagraphHP>
                        <ParagraphHP>
                            Anforderungen
                            <br />
                            Das Projekt sollte mit modernen Technologien als echte Single Page
                            Application umgesetzt werden. Ziel war es, auf Technologien zu setzen,
                            mit denen ich vertraut bin, um Konzepte schnell und effizient umsetzen
                            zu können - insbesondere PHP/MySQL sowie React, TypeScript und CSS.
                            <br />
                            <br />
                            Gleichzeitig wollte ich neue, skalierbare Frameworks einsetzen, mit
                            denen ich bisher noch nicht gearbeitet hatte, darunter Laravel und die
                            MUI React Component Library (zuvor hatte ich ausschließlich eigene
                            Component Libraries entwickelt).
                        </ParagraphHP>
                        <ParagraphHP>
                            Erweiterter Funktionsumfang
                            <br />
                            Zusätzlich existierte bereits ein programmiertes Fullstack-Projekt, mit
                            dem Nutzer per Mausklick ein Layout-Grid zusammenstellen und den
                            generierten Layout-Code kopieren konnten. Diese Anwendung sollte in
                            einem geschützten Bereich der Homepage integriert werden.
                            <br />
                            <br />
                            Hierfür war ein umfassender Rewrite notwendig, da die Anwendung auf
                            einer anderen REST-API-Architektur basierte. Zudem wurde das Frontend
                            zuvor hybrid gerendert - sowohl server- als auch clientseitig.
                            <br />
                            <br />
                            React mit Tailwind blieb als zentrale Technologie für die
                            Template-Struktur erhalten und wurde so integriert, dass eine
                            performante Koexistenz mit Seiten auf Basis der MUI Component Library
                            möglich ist.
                        </ParagraphHP>
                        <ParagraphHP>
                            Anspruch: <br />
                            <ul>
                                <li>Clean.</li>
                                <li>Performant.</li>
                                <li>Getestet.</li>
                                <li>Versioniert.</li>
                                <li>Dokumentiert.</li>
                            </ul>
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
                            Mit dieser Web-App können Nutzer Layout-Grids dynamisch über eine
                            Konfiguration erstellen.
                            <br />
                            <br />
                            Das erstellte Layout-Grid wird in Echtzeit angezeigt und kann zusätzlich
                            als HTML-Code ausgegeben sowie per Button kopiert werden.
                            <br />
                            <br />
                            Nutzer können beliebig viele Layout-Grids speichern und verwalten.
                            Gespeicherte Grids lassen sich umbenennen, löschen sowie alphabetisch
                            oder nach Datum sortieren. Zudem können gespeicherte Layouts jederzeit
                            auf das aktuelle Layout angewendet werden.
                        </ParagraphHP>
                        <ParagraphHP>Testen Sie die Template Engine gerne selbst.</ParagraphHP>
                        <ParagraphHP>
                            <MuiLink
                                component={RouterLinkWrapper}
                                href="/template-engine"
                                color="rgba(53,102,64, 1)"
                            >
                                zur Template Engine
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
                            Der vollständige Projektcode ist auf GitHub verfügbar, inklusive
                            strukturierter README-Dokumentation für Frontend und Backend.
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
