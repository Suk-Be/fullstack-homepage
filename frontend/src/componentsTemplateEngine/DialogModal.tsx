import Button from '@/componentsTemplateEngine/buttons/Button';
import CopyButton from '@/componentsTemplateEngine/buttons/CopyButton';
import DynamicGridMarkup from '@/componentsTemplateEngine/gridConfiguration/markUp/dynamicMarkUpGenerator/DynamicGridMarkup';
import DynamicGridLayout from '@/componentsTemplateEngine/presetRenderings/DynamicGrid';
import { ModalProps } from '@/types/templateEngine';
import { buttonText } from '@/utils/templateEngine/buttonText';
import { componentToHtmlText, toDomModel } from '@/utils/templateEngine/parseHtmlToText';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

function DialogModal({
    inlineStyles,
    gridItemsArray,
    handleClose,
    handleOpen,
    setIsOpen,
    isOpen,
}: ModalProps) {
    const renderMarkup = () => (
        <DynamicGridMarkup
            Component={<DynamicGridLayout style={inlineStyles} arr={gridItemsArray} />}
        />
    );

    function copyToClipboard() {
        const html = toDomModel(componentToHtmlText(renderMarkup())).body.firstChild;

        if (html) {
            navigator.clipboard.writeText(html.textContent || '');
        }

        setIsOpen({
            ...isOpen,
            isCopied: true,
        });
        setTimeout(
            () =>
                setIsOpen({
                    ...isOpen,
                    isCopied: false,
                }),
            750,
        );
    }

    return (
        <div className="flex flex-col gap-2" data-testid="dialog-modal">
            <Button
                className="w-full h-auto bg-gray text-white"
                onClick={handleOpen}
                data-testid="button-open"
            >
                Export HTML + Tailwind
            </Button>

            <Dialog
                open={isOpen.open}
                as="div"
                className="relative z-10 focus:outline-none"
                onClose={close}
                data-testid="dialog-markup"
            >
                <DialogBackdrop className="fixed inset-0 bg-black/30" />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-11/12 rounded-xl bg-gray p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-lg font-bold py-4 text-white">
                                Grid: HTML + Tailwind
                            </DialogTitle>

                            <div className="bg-gray-dark text-green p-3 rounded-xl mb-4">
                                {renderMarkup()}
                            </div>

                            <div className="mt-4">
                                <CopyButton onClick={copyToClipboard}>
                                    {isOpen.isCopied
                                        ? buttonText.copyToClipboard[1]
                                        : buttonText.copyToClipboard[0]}
                                </CopyButton>

                                <Button
                                    className="py-4 rounded-xl bg-white text-gray-light"
                                    onClick={handleClose}
                                >
                                    Close
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default DialogModal;
