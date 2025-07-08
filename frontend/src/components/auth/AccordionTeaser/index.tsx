import { ArrowCircleDown, ArrowCircleUp } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { testId } from '../../../utils/testId';
import { Card, SignInContainer as SignUpContainer } from '../../ContainerElements';
import { HeadlineSignInUp as Headline, ParagraphHP } from '../../TextElements';

export default function AccordionExpandIcon() {
    return (
        <SignUpContainer direction="column" justifyContent="space-between">
            <Card variant="outlined">
                <Accordion defaultExpanded>
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
                <Accordion>
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </ParagraphHP>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </SignUpContainer>
    );
}
