import DialogModal from '@/componentsTemplateEngine/modals/CreateMarkupModal';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Deine inlineStyles
const inlineStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '0px',
    borderWidth: '0rem',
    padding: 'calc(0rem * 2) calc(0rem * 2)',
};

// gridItemsArray als plain numbers
const gridItemsArray = [1, 2, 3];

describe('DialogModal', () => {
    let spyWriteText: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        spyWriteText = vi.fn();
        vi.stubGlobal('navigator', {
            clipboard: {
                writeText: spyWriteText,
            },
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const renderUtils = () => {
        const user = userEvent.setup();
        render(<DialogModal inlineStyles={inlineStyles} gridItemsArray={gridItemsArray} />);

        return {
            user,
            button: screen.getByRole('button', { name: /html \+ tailwind/i }),
        };
    };

    it('renders the trigger button', () => {
        const { button } = renderUtils();
        expect(button).toBeInTheDocument();
    });

    it('opens and closes the dialog via close icon', async () => {
        const { user, button } = renderUtils();
        await user.click(button);

        expect(await screen.findByTestId('dialog-markup')).toBeVisible();
        expect(screen.getByText(/grid: html \+ tailwind/i)).toBeInTheDocument();

        await user.click(screen.getByLabelText(/close modal/i));

        await waitFor(() => {
            expect(screen.queryByTestId('dialog-markup')).not.toBeInTheDocument();
        });
    });

    it('copies markup and shows "Copied" feedback', async () => {
        const { user, button } = renderUtils();
        await user.click(button);

        const copyBtn = await screen.findByRole('button', { name: /copy to clipboard/i });
        await user.click(copyBtn);

        expect(await screen.findByText(/copied/i)).toBeInTheDocument();

        const rerenderButtonAfterTime = 750;
        await waitFor(
            () => {
                expect(
                    screen.getByRole('button', { name: /copy to clipboard/i }),
                ).toBeInTheDocument();
            },
            { timeout: rerenderButtonAfterTime },
        );
    });

    it('closes modal via "Close" button inside the modal', async () => {
        const { user, button } = renderUtils();
        await user.click(button);

        const closeBtn = await screen.findByText('Close');
        await user.click(closeBtn);

        await waitFor(() => {
            expect(screen.queryByTestId('dialog-markup')).not.toBeInTheDocument();
        });
    });
});
