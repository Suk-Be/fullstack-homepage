import ProjectTemplateEnginePresetsPage from '@/pages/ProjectTemplateEngineLayoutExamplesPage';
import { renderWithProvidersDOM } from '@/tests/utils/testRenderUtils';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('ProjectTemplateEnginePresetsPage', () => {
    const renderUtils = () => {
        renderWithProvidersDOM(<ProjectTemplateEnginePresetsPage />, {
            route: '/template-engine/presets',
            preloadedState: {
                login: {
                    isLoggedIn: true,
                    isLoading: false,
                },
                userGrid: {
                    userId: 123,
                    savedGrids: {},
                },
            },
        });
    };

    const testIDs = [
        'example-simple-grid-gap-4',
        'example-simple-grid-gap-2',
        'example-spanning-grid-col-span-2',
        'example-spanning-grid-col-row-span',
    ];

    it('should render all grid preset examples with correct testIDs', () => {
        for (const id of testIDs) {
            const section = screen.getByTestId(id);
            expect(section).toBeInTheDocument();
        }
    });

    it('should render all markup toggle buttons and be able to interact', () => {
        renderUtils();

        const toggleButtons = screen.getAllByRole('button', {
            name: /show markup/i,
        });

        expect(toggleButtons.length).toBe(4); // 4 presets → 4 buttons

        toggleButtons.forEach((btn) => {
            fireEvent.click(btn);
            expect(btn.textContent?.toLowerCase()).toMatch(/hide markup/i);
        });
    });

    it('should render all copy to clipboard buttons and be able to interact', () => {
        renderUtils();

        const coypButtons = screen.getAllByRole('button', {
            name: /copy to clipboard/i,
        });

        expect(coypButtons.length).toBe(4); // 4 presets → 4 buttons

        coypButtons.forEach((btn) => {
            fireEvent.click(btn);
            expect(btn.textContent?.toLowerCase()).toMatch(/is copied/i);
        });
    });
});
