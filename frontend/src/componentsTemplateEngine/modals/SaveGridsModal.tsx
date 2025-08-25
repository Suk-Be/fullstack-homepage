import Button from '@/componentsTemplateEngine/buttons/Button';
import SavedGridList from '@/componentsTemplateEngine/gridSaver/SavedGridList';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUserId } from '@/store/selectors/loginSelectors';
import { persistGridsinLocalStorage, saveInitialGridAsUUID } from '@/store/userSaveGridsSlice';
import { testId } from '@/utils/testId';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useEffect, useState } from 'react';

function SaveGridsModal() {
    const [isOpen, setIsOpen] = useState({
        open: false,
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [gridName, setGridName] = useState('');
    const [hasGrid, setHasGridIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen({ ...isOpen, open: true });
        setIsButtonDisabled(false);
        setHasGridIsOpen(false);
    };

    const handleClose = () => {
        setIsOpen({ ...isOpen, open: false });
        setIsButtonDisabled(false);
        setHasGridIsOpen(false);
    };

    const dispatch = useAppDispatch();
    const userId = useAppSelector(selectUserId);

    useEffect(() => {
        if (userId) {
            // connects userId from loginReducer with userGridReducer
            dispatch(persistGridsinLocalStorage(userId));
        }
    }, [userId, dispatch]);

    const handleGrid = () => {
        setHasGridIsOpen(true);
        setIsButtonDisabled(true);

        dispatch(saveInitialGridAsUUID());

        setGridName('');
    };

    return (
        <div className="flex flex-col gap-2 font-sans" {...testId('dialog-modal')}>
            <Button
                className="
                  w-full 
                  min-h-[200px]
                  bg-gray text-white"
                onClick={handleOpen}
            >
                Meaningful names do half the work.
            </Button>

            <Dialog
                open={isOpen.open}
                as="div"
                className="relative z-10 focus:outline-none"
                onClose={handleClose}
                {...testId('dialog-markup')}
            >
                <DialogBackdrop className="fixed inset-0 bg-white/50 transition-opacity data-[closed]:opacity-0" />

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
                                Save Grid
                            </DialogTitle>

                            {!hasGrid && (
                                <>
                                    <input
                                        name="full_name"
                                        type="text"
                                        placeholder="please name grid"
                                        value={gridName}
                                        onChange={(e) => setGridName(e.target.value)}
                                        className="bg-gray-700 text-green-400 p-3 rounded-xl mb-4 overflow-auto max-h-96"
                                    />
                                </>
                            )}

                            {hasGrid && (
                                <div className="bg-gray-700 text-green-400 p-3 rounded-xl mb-4 overflow-auto max-h-96">
                                    <div>
                                        {!userId && (
                                            <p className="text-gray-700">User not loaded yet.</p>
                                        )}
                                        <SavedGridList />
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 flex justify-end gap-3">
                                <Button
                                    className="py-4 rounded-xl 
                                                text-white 
                                                bg-gray-dark
                                                data-[hover]:bg-gray 
                                                data-[open]:bg-gray/700"
                                    onClick={handleGrid}
                                    disabled={isButtonDisabled}
                                >
                                    save
                                </Button>

                                <Button
                                    className="py-4 rounded-xl bg-white text-gray-light"
                                    onClick={handleClose}
                                >
                                    close
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default SaveGridsModal;
