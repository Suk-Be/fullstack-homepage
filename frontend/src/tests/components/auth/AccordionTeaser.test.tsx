import { mockLoggedInAdminState } from '@/tests/mocks/redux';
import { navigateTo } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { vi } from 'vitest';

const windowOpen = window.open;
window.open = vi.fn();

vi.mock('@/hooks/useScroll', () => ({ default: vi.fn() }));
vi.mock('@/components/RouterLink', () => ({
    default: (props: ComponentProps<'a'>) => <a {...props} />,
}));

describe('AccordionTeaser', () => {
    const renderUtils = async () => {
        const user = userEvent.setup();

        navigateTo({ route: '/', preloadedState: mockLoggedInAdminState });

        const accordion = await screen.findByTestId('accordion');
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
        projekte: /Die bestehende Website aus dem Jahr 2014 war dringend/i,
        templateEngine:
            /Mit dieser Web-App können Nutzer Layout-Grids dynamisch über eine Konfiguration erstellen./i,
        codeRepo: /Der vollständige Projektcode ist auf GitHub verfügbar/i,
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        window.open = windowOpen;
    });

    it('should render accordion with initially expanded entries', async () => {
        const { projekte, templateEngine, codeRepo } = await renderUtils();

        expect(projekte).toBeInTheDocument();
        expect(templateEngine).toBeInTheDocument();
        expect(codeRepo).toBeInTheDocument();

        expect(screen.getByText(content.projekte)).not.toBeVisible();
        expect(screen.getByText(content.templateEngine)).toBeVisible();
        expect(screen.getByText(content.codeRepo)).toBeVisible();
    });

    it('should toogle accordion entries', async () => {
        const { user, projekte, templateEngine, codeRepo } = await renderUtils();

        // Accordion content initially
        expect(screen.queryByText(content.projekte)).not.toBeVisible();
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
    it('should open the github repository link when clicking the button', async () => {
        const { user } = await renderUtils();

        const repoButton = screen.getByTestId('form-button-login-with-github');

        await user.click(repoButton);

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(
            'https://github.com/Suk-Be/fullstack-homepage',
            '_blank',
        );
    });
});
