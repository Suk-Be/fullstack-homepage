import RegisterButtonSocialite from '@/components/auth/shared-components/RegisterButtonSocialite';
import { Card, SignInContainer as SignUpContainer } from '@/components/ContainerElements';
import RouterLinkWrapper from '@/components/RouterLink';
import { GithubIcon } from '@/components/shared-components/CustomIcons';
import { HeadlineSignInUp as Headline, ParagraphHP } from '@/components/TextElements';
import { handleSignInUp } from '@/utils/clickHandler';
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
                        <Headline>Projekte</Headline>
                    </AccordionSummary>
                    <AccordionDetails {...testId('accordion-projekte-content')}>
                        <ParagraphHP>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
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
                            tailwind spielt Stärken im schnellen Prototyping von Designs aus und
                            schwächelt hingegen ein wenig wenn es um Skalier- und Modulierbarkeit
                            geht.
                        </ParagraphHP>
                        <ParagraphHP>
                            Mit dieser CSS Technologie habe ich eine Template Engine gebaut mit der
                            man simple dynamische Layouts rendern und als HTML Code ausgeben kann.
                        </ParagraphHP>
                        <ParagraphHP>
                            <MuiLink
                                component={RouterLinkWrapper}
                                href="/template-engine"
                                color="rgba(53,102,64, 1)"
                            >
                                zum Prototypen
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
                            Der Code für diese App ist in einem privaten Code Repository hinterlegt.
                            Bitte nutzen Sie den mit github anmelden Button, um Zugang für das
                            private Repo zu erhalten.
                        </ParagraphHP>
                        <ParagraphHP>
                            Das <b>Backend</b> ist in PHP geschrieben und ist REST Api Provider für
                            Single Page Applications. Dafür nutze ich das Laravel framework und
                            schreibe unit/integrations tests.
                        </ParagraphHP>
                        <ParagraphHP>
                            Für das <b>Frontend</b> nutze ich TypeScript. Als framework nutze ich
                            react, redux toolkit, react-router. Für die unit/integrations tests
                            nutze ich vitest, rtl und msw.
                        </ParagraphHP>
                        <ParagraphHP>
                            FYI: Für das Design der Home Page nutze ich angepasste Material UI
                            components.
                        </ParagraphHP>

                        <ParagraphHP>
                            todo Logik: Wenn man als github angebmeldet ist ist hier nur der Link
                            zum Repository zu sehen. Sonst nur der Button &quot;Anmelden mit
                            Github&quot; der hat die gleiche Funktionalität mit callback und
                            redirect auf die gleiche Seite. Ein toast mit Hinweis auf den Link oder
                            ähnliches wäre gut.
                        </ParagraphHP>

                        <ParagraphHP sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <RegisterButtonSocialite
                                startIcon={<GithubIcon />}
                                text="Anmelden mit Github"
                                testIdIdentifier="form-button-login-with-github"
                                clickHandler={() => handleSignInUp('github')}
                            />
                            <MuiLink
                                component={RouterLinkWrapper}
                                href="/test-another-project"
                                color="rgba(53,102,64, 1)"
                            >
                                zum Repository
                            </MuiLink>
                        </ParagraphHP>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </SignUpContainer>
    );
}
