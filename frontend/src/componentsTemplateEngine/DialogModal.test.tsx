import { buttonText } from '../utils/templateEngine/buttonText';
import { act, fireEvent, render, screen } from '@testing-library/react';
import DialogModal from './DialogModal';
import { vi } from 'vitest';

describe('DialogModal', () => {
    beforeAll(() => {
        HTMLDialogElement.prototype.show = vi.fn();
        HTMLDialogElement.prototype.showModal = vi.fn();
        HTMLDialogElement.prototype.close = vi.fn();
    });

    it('should call the toggle methods on the modal', async () => {
        const defaultStyle = {
            display: 'grid',
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
            gap: '0px',
            borderWidth: '0rem',
            padding: 'calc(0rem * 2) calc(0rem * 2)',
        };

        const gridDefault = [1];

        const handleClose = vi.fn();
        const handleOpen = vi.fn();
        const setIsOpen = vi.fn();

        const isOpen = {
            open: true,
            text: buttonText.copyToClipboard[1],
            isCopied: false,
        };

        await act(async () => {
            render(
                <>
                    <DialogModal
                        inlineStyles={defaultStyle}
                        gridItemsArray={gridDefault}
                        handleClose={handleClose}
                        handleOpen={handleOpen}
                        setIsOpen={setIsOpen}
                        isOpen={isOpen}
                    />
                </>,
            );
        });
        const openButton = screen.getByText(/export/i);
        const closeButton = screen.getByText(/close/i);

        fireEvent.click(openButton);

        expect(handleOpen).toHaveBeenCalled();

        fireEvent.click(closeButton);

        expect(handleClose).toHaveBeenCalled();
    });
});
