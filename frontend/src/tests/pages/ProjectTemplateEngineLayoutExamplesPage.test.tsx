import ProjectTemplateEnginePresetsPage from '@/pages/ProjectTemplateEngineLayoutExamplesPage';
import { renderWithProvidersDOM } from '@/tests/utils/testRenderUtils';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { userLoggedAdmin } from '../mocks/handlers';

describe('ProjectTemplateEnginePresetsPage', () => {
    const renderUtils = () => {
        const user = userEvent.setup();

        renderWithProvidersDOM(<ProjectTemplateEnginePresetsPage />, {
            route: '/template-engine/presets',
            preloadedState: {
                login: {
                    isLoggedIn: true,
                    isLoading: false,
                },
                userGrid: {
                    userId: userLoggedAdmin,
                    savedGrids: {},
                },
            },
        });

        return { user };
    };

    const testIDs = [
        'example-simple-grid-gap-4',
        'example-simple-grid-gap-2',
        'example-spanning-grid-col-span-2',
        'example-spanning-grid-col-row-span',
    ];

    it('should render all grid preset examples with correct testIDs', async () => {
        renderUtils();

        for (const id of testIDs) {
            const section = await screen.findByTestId(id);
            expect(section).toBeInTheDocument();
        }
    });

    it('should render all markup toggle buttons and be able to interact', async () => {
        const { user } = renderUtils();

        const toggleButtons = screen.getAllByRole('button', {
            name: /show markup/i,
        });

        expect(toggleButtons.length).toBe(4); // 4 presets → 4 buttons

        for (const btn of toggleButtons) {
            await user.click(btn);
            expect(btn.textContent?.toLowerCase()).toMatch(/hide markup/i);
        }
    });

    it('should render all copy to clipboard buttons and be able to interact', async () => {
        const { user } = renderUtils();

        const coypButtons = screen.getAllByRole('button', {
            name: /copy to clipboard/i,
        });

        expect(coypButtons.length).toBe(4);

        for (const btn of coypButtons) {
            await user.click(btn);
            expect(btn.textContent?.toLowerCase()).toMatch(/is copied/i);
        }
    });
});
