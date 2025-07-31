import Button from '@/componentsTemplateEngine/buttons/Button';
import CopyButton from '@/componentsTemplateEngine/buttons/CopyButton';
import CreateGridLayout from '@/componentsTemplateEngine/gridConfiguration/CreateGridLayout';
import CreateGridMarkUp from '@/componentsTemplateEngine/gridConfiguration/markUp/dynamicMarkUpGenerator/CreateGridMarkUp';
import { ModalProps } from '@/types/templateEngine';
import { buttonText } from '@/utils/templateEngine/buttonText';
import {
    createHtmlAsTextFromPassedComponent,
    parseStringToADomModel,
} from '@/utils/templateEngine/parseHtmlToText';
import { testId } from '@/utils/testId';
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
        <CreateGridMarkUp
            Component={<CreateGridLayout style={inlineStyles} arr={gridItemsArray} />}
        />
    );

    function copyToClipboard() {
        const html = parseStringToADomModel(createHtmlAsTextFromPassedComponent(renderMarkup()))
            .body.firstChild;

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
        <div className="flex flex-col gap-2 font-sans" {...testId('dialog-modal')}>
            <Button
                className="
                  w-full 
                  min-h-[200px]
                  bg-gray text-white"
                onClick={handleOpen}
            >
                HTML + Tailwind
            </Button>

            <Dialog
                open={isOpen.open}
                as="div"
                className="relative z-10 focus:outline-none"
                onClose={handleClose}
                {...testId('dialog-markup')}
            >
                <DialogBackdrop className="fixed inset-0 bg-black/50 transition-opacity data-[closed]:opacity-0" />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-11/12 rounded-xl bg-gray p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            {/* Close Button (X icon) */}
                            <button
                                type="button"
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-full p-1 transition-colors"
                                aria-label="Close modal"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            <DialogTitle as="h3" className="text-xl font-bold py-4 text-white">
                                Grid: HTML + Tailwind
                            </DialogTitle>

                            <div className="bg-gray-700 text-green-400 p-3 rounded-xl mb-4 overflow-auto max-h-96">
                                {renderMarkup()}
                            </div>

                            <div className="mt-4 flex justify-end gap-3">
                                <CopyButton
                                    onClick={copyToClipboard}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                                >
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
