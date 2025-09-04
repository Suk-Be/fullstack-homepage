import Button from '@/componentsTemplateEngine/buttons/Button';
import SavedGridList from '@/componentsTemplateEngine/modals/SaveGridsModal/savedGridList';
import { CloseSVG } from '@/componentsTemplateEngine/svgs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUserId } from '@/store/selectors/loginSelectors';
import { selectGridsFromThisUser } from '@/store/selectors/userGridSelectors';
import { getGridsFromLocalStorage, resetUserGrids, saveInitialGrid } from '@/store/userSaveGridsSlice';
import { testId } from '@/utils/testId';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';

function SaveGridsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [gridName, setGridName] = useState('');
    const [hasGrid, setHasGridIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleOpen = () => {
        setIsOpen(true);
        setIsButtonDisabled(false);
        setHasGridIsOpen(false);
        setErrorMessage('');
    };

    const handleClose = () => {
        setIsOpen(false);
        setIsButtonDisabled(false);
        setHasGridIsOpen(false);
    };

    const dispatch = useAppDispatch();
    const userId = useAppSelector(selectUserId);
    const userGrids = useAppSelector(selectGridsFromThisUser);

    // Läuft nur, wenn Modal geöffnet wird
    useEffect(() => {
      if (isOpen) {
        setGridName('');
        inputRef.current?.focus();
      }
    }, [isOpen]);



    // Läuft nur, wenn sich die userId ändert
    useEffect(() => {
      if (userId) {
        dispatch(getGridsFromLocalStorage(userId));
      }
    }, [userId, dispatch]);


    const handleGrid = () => {
        if (!gridName.trim()) {
            setErrorMessage('Please input a recognizable name.');
            return;
        }

        const gridNameAlreadyExists = userGrids?.some(
            (grid) => grid.name.toLowerCase() === gridName.toLowerCase()
        );

        if (gridNameAlreadyExists) {
            setErrorMessage(
                `A grid with the name "${gridName}" already exists. Please choose a different name.`
            );
            return;
        }

        if (errorMessage) return;

        setHasGridIsOpen(true);
        setIsButtonDisabled(true);

        dispatch(saveInitialGrid(gridName));

        setGridName('');
    };

    const resetGrids = () => {
        setIsButtonDisabled(true);

        dispatch(resetUserGrids());

        setGridName('');
        setHasGridIsOpen(false);
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
                ... with a meaningful name
            </Button>

            <Dialog
                open={isOpen}
                as="div"
                className="relative z-10 focus:outline-none"
                onClose={handleClose}
                initialFocus={inputRef}
                {...testId('dialog-markup')}
            >
                <DialogBackdrop className="fixed inset-0 bg-white/50 transition-opacity data-[closed]:opacity-0" />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-11/12 lg:w-8/12 rounded-xl bg-gray p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            {/* Close Button (X icon) */}
                            <button
                                type="button"
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-full p-1 transition-colors"
                                aria-label="Close modal"
                            >
                                <CloseSVG />
                            </button>

                            <DialogTitle as="h3" className="text-xl font-bold py-4 text-white">
                                Save Grid
                            </DialogTitle>

                            {!hasGrid && (
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4  items-center'>
                                    <input
                                      ref={inputRef}
                                      name="full_name"
                                      type="text"
                                      placeholder="name of the grid"
                                      value={gridName}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setGridName(value)
                                        if (value.length > 30) {
                                          setErrorMessage(`${value.length}/30 characters – the grid name is too long.`);
                                        } else {
                                          setErrorMessage('');
                                        }
                                      }}
                                      onFocus={() => setErrorMessage('')}
                                      // maxLength={255} backend linit
                                      className="bg-gray-700 text-green-400 p-3 rounded-xl mb-4 overflow-auto max-h-96"
                                    />

                                    {errorMessage && (
                                        <Description className="text-green-400 text-sm mb-4" {...testId('grid-error')}>{errorMessage}</Description>
                                    )}
                                </div>
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
                                    className="py-4 rounded-xl 
                                                text-white 
                                                bg-gray-dark
                                                data-[hover]:bg-gray 
                                                data-[open]:bg-gray/700"
                                    onClick={resetGrids}
                                    disabled={isButtonDisabled}
                                >
                                    reset
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
