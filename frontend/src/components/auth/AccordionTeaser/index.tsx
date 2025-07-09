import { ArrowCircleDown, ArrowCircleUp } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Link as MuiLink } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { testId } from '../../../utils/testId';
import { Card, SignInContainer as SignUpContainer } from '../../ContainerElements';
import RouterLinkWrapper from '../../RouterLink';
import { HeadlineSignInUp as Headline, ParagraphHP } from '../../TextElements';

export default function AccordionExpandIcon() {
    return (
        <SignUpContainer direction="column" justifyContent="space-between">
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
                    >
                        <Headline {...testId('headline-accordion')}>Projekte</Headline>
                    </AccordionSummary>
                    <AccordionDetails>
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
                    >
                        <Headline {...testId('headline-accordion')}>Template Engine</Headline>
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
                    >
                        <Headline {...testId('headline-accordion')}>Test Page</Headline>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ParagraphHP>Noch eine Test Seite.</ParagraphHP>
                        <ParagraphHP>
                            <MuiLink
                                component={RouterLinkWrapper}
                                href="/test-another-project"
                                color="rgba(53,102,64, 1)"
                            >
                                zum Prototypen
                            </MuiLink>
                        </ParagraphHP>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </SignUpContainer>
    );
}
