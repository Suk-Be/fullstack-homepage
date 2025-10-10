import { mockLoggedInAdminState } from '@/tests/mocks/redux';
import { navigateTo } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { vi } from 'vitest';

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
        projekte: /Es gibt einen MVP für die Template Engine/i,
        templateEngine:
            /Die Template Engine nutzt ein php backend mit controllern, sql, policies und provided eine RestApi Schnittstelle./i,
        codeRepo: /Der Code für diese App ist in einem Code Repository hinterlegt./i,
    };

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
});
