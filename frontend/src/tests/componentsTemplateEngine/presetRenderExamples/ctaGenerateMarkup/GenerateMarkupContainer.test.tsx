import GenerateMarkupContainer from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const DummyComponent = () => <div data-testid="dummy-component">Hello World</div>;

describe('GenerateMarkupContainer', () => {
    beforeEach(() => {
        vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(vi.fn());
    });

    const renderUtils = () => {
        const user = userEvent.setup();
        render(<GenerateMarkupContainer component={<DummyComponent />} />);

        return {
            user,
        };
    };

    it('should render toggle and copy buttons with default texts', () => {
        renderUtils();

        expect(screen.queryByTestId('markup-component')).not.toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Show Markup/i })).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Copy to Clipboard/i })).toBeInTheDocument();
    });

    it('should show the markup when toggle button is clicked', async () => {
        const { user } = renderUtils();

        const toggleButton = screen.getByRole('button', { name: /Show Markup/i });

        await user.click(toggleButton);

        expect(screen.getByTestId('markup-component')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Hide Markup/i })).toBeInTheDocument();
    });

    it('should copy the markup when copy button is clicked', async () => {
        const { user } = renderUtils();
        await user.click(screen.getByRole('button', { name: /Show Markup/i }));
        await user.click(screen.getByRole('button', { name: /Copy to Clipboard/i }));

        expect(navigator.clipboard.writeText).toHaveBeenCalled();

        expect(screen.getByRole('button', { name: /Is copied to Clipboard/i })).toBeInTheDocument();

        vi.useFakeTimers();
        await act(async () => {
            vi.advanceTimersByTime(750);
            // manually execute second state update from clickHandlerCopy
            renderUtils();
            await Promise.resolve();
        });

        expect(screen.getByRole('button', { name: /Copy to Clipboard/i })).toBeInTheDocument();

        vi.useRealTimers();
    });
});
