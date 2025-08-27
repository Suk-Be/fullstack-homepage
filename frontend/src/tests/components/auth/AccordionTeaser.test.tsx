import { navigateTo } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('AccordionTeaser', () => {
    const renderUtils = () => {
        const user = userEvent.setup();

        navigateTo({ route: '/', preloadedState: { login: { isLoggedIn: true } } });

        const accordion = screen.getByTestId('accordion');
        const projekte = screen.getByTestId('accordion-projekte');
        const templateEngine = screen.getByTestId('accordion-template-engine');
        const codeRepo = screen.getByTestId('accordion-code-repository');

        return {
            user,
            accordion,
            projekte,
            templateEngine,
            codeRepo,
        };
    };

    const content = {
        projekte: /Lorem ipsum dolor sit amet/i,
        templateEngine:
            'tailwind spielt Stärken im schnellen Prototyping von Designs aus und schwächelt hingegen ein wenig wenn es um Skalier- und Modulierbarkeit geht.',
        codeRepo:
            'Der Code für diese App ist in einem privaten Code Repository hinterlegt. Bitte nutzen Sie den mit github anmelden Button, um Zugang für das private Repo zu erhalten.',
    };

    it('should render accordion with initially expanded entries', () => {
        const { projekte, templateEngine, codeRepo } = renderUtils();

        expect(projekte).toBeInTheDocument();
        expect(templateEngine).toBeInTheDocument();
        expect(codeRepo).toBeInTheDocument();

        expect(screen.getByText(content.projekte)).not.toBeVisible();
        expect(screen.getByText(content.templateEngine)).toBeVisible();
        expect(screen.getByText(content.codeRepo)).toBeVisible();
    });

    it('should toogle accordion entries', async () => {
        const { user, projekte, templateEngine, codeRepo } = renderUtils();

        // Accordion content initially
        expect(screen.getByText(content.projekte)).not.toBeVisible();
        expect(screen.getByText(content.templateEngine)).toBeVisible();
        expect(screen.getByText(content.codeRepo)).toBeVisible();

        await user.click(projekte);
        expect(screen.getByText(content.projekte)).toBeVisible();
        await user.click(projekte);
        expect(screen.getByText(content.projekte)).not.toBeVisible();

        await user.click(templateEngine);
        expect(screen.getByText(content.templateEngine)).not.toBeVisible();
        await user.click(templateEngine);
        expect(screen.getByText(content.templateEngine)).toBeVisible();

        await user.click(codeRepo);
        expect(screen.getByText(content.codeRepo)).not.toBeVisible();
        await user.click(codeRepo);
        expect(screen.getByText(content.codeRepo)).toBeVisible();
    });

    // it('should link to repo if logged in with github accout', async () => {
    //     // todo
    //     renderUtils()
    // });

    // it('should log in with github accout and redirect to home page', async () => {
    //     // todo
    //     renderUtils()
    // });
});
