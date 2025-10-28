import Button from '@/componentsTemplateEngine/buttons/Button';
import SavedGridList from '@/componentsTemplateEngine/modals/SaveGridsModal/savedGridList';
import { isGridNameUnique } from '@/componentsTemplateEngine/modals/SaveGridsModal/shared/IsGridNameUnique';
import { CloseSVG } from '@/componentsTemplateEngine/svgs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUserId, selectUserRole } from '@/store/selectors/loginSelectors';
import { selectGridsFromThisUser, selectNewGrid } from '@/store/selectors/userGridSelectors';
import {
    fetchUserGridsThunk,
    resetUserGridsThunk,
    saveUserGridThunk,
} from '@/store/thunks/userSaveGridsThunks';
import {
    createGrid,
    getGridsFromLocalStorage,
    initialGridConfig,
    initialLayoutId,
} from '@/store/userSaveGridsSlice';
import { GridConfig, GridConfigKey } from '@/types/Redux';
import { sanitizeWithFeedback } from '@/utils/sanitizeInput';
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
    const userRole = useAppSelector(selectUserRole);
    const savedGrids = useAppSelector(selectGridsFromThisUser); // GridConfig[]
    const gridConfig = useAppSelector(selectNewGrid);

    // sideffects
    useEffect(() => {
        if (isOpen) {
            setGridName('');
            inputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (userId) {
            dispatch(getGridsFromLocalStorage(userId));
        }
    }, [userId, dispatch]);

    // helpers
    const hasValidUser = (): boolean => {
        if (!userId) {
            setErrorMessage('User not logged in.');
            return false;
        }
        return true;
    };

    // isConfigUnique
    const CONFIG_KEYS: GridConfigKey[] = [
        'items',
        'columns',
        'gap',
        'border',
        'paddingX',
        'paddingY',
    ];

    const isConfigEqual = (a: GridConfig['config'], b: GridConfig['config']): boolean => {
        if (!a || !b) {
            console.warn('isConfigEqual called with invalid configs:', { a, b });
            return false;
        }

        return CONFIG_KEYS.every((k) => {
            const valA = a[k];
            const valB = b[k];

            if (valA === undefined || valB === undefined) {
                console.warn('Missing key in config', { key: k, valA, valB, a, b });
            }

            return String(valA) === String(valB);
        });
    };

    const isConfigUnique = (): boolean => {
        const baseConfig = savedGrids[initialLayoutId]?.config ?? initialGridConfig;

        const exists = Object.entries(savedGrids)
            .filter(([key]) => key !== initialLayoutId)
            .some(([, grid]) => isConfigEqual(grid.config, baseConfig));

        if (exists) {
            setErrorMessage('A grid with the same configuration already exists.');
            return false;
        }

        return true;
    };

    // handler
    const handleShowGrids = async () => {
        if (!hasValidUser()) return;

        setIsButtonDisabled(true);

        try {
            await dispatch(fetchUserGridsThunk(userId!)).unwrap();
            setHasGridIsOpen(true); // SavedGridList wird angezeigt
        } catch (err) {
            alert('Fehler beim Laden der Grids: ' + err);
        } finally {
            setIsButtonDisabled(false);
        }

        setIsButtonDisabled(true);
    };

    const handleSaveGrid = async () => {
        if (!hasValidUser()) return;

        // if sanitied grid name inform user
        const sanitizedGridName = sanitizeWithFeedback({
            value: gridName,
            setValue: setGridName,
            setError: setErrorMessage,
        });
        if (sanitizedGridName) return;

        const isUniqueName = isGridNameUnique(gridName, savedGrids, setErrorMessage);
        if (!isUniqueName) return;
        if (!isConfigUnique()) return;

        setHasGridIsOpen(true);
        setIsButtonDisabled(true);

        const newGrid = createGrid(gridConfig, gridName);
        try {
            await dispatch(saveUserGridThunk(newGrid)).unwrap();
            setGridName('');
        } catch (err: unknown) {
            alert('Fehler beim Speichern: ' + err);
        } finally {
            setIsButtonDisabled(true);
        }
    };

    const handleResetGrids = async () => {
        if (!hasValidUser()) return;

        if (!confirm('Alle Grids dieses Users wirklich löschen?')) return;

        setIsButtonDisabled(true);

        await dispatch(resetUserGridsThunk(userId!))
            .unwrap()
            .then(() => {
                alert('Grids erfolgreich zurückgesetzt!');
                setHasGridIsOpen(false);
                setGridName('');
            })
            .catch((err) => {
                alert('Fehler beim Reset: ' + err);
            })
            .finally(() => {
                setIsButtonDisabled(true);
            });
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
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4  items-center">
                                    <input
                                        ref={inputRef}
                                        name="full_name"
                                        type="text"
                                        placeholder="name of the grid"
                                        value={gridName}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setGridName(value);
                                            if (value.length > 30) {
                                                setErrorMessage(
                                                    `${value.length}/30 characters – the grid name is too long.`,
                                                );
                                            } else {
                                                setErrorMessage('');
                                            }
                                        }}
                                        onFocus={() => setErrorMessage('')}
                                        // maxLength={255} backend linit
                                        className="bg-gray-700 text-green-400 p-3 rounded-xl mb-4 overflow-auto max-h-96"
                                    />

                                    {errorMessage && (
                                        <Description
                                            className="text-green-400 text-sm mb-4"
                                            {...testId('grid-error')}
                                        >
                                            {errorMessage}
                                        </Description>
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
                                    onClick={handleSaveGrid}
                                    disabled={isButtonDisabled}
                                >
                                    save
                                </Button>

                                <Button
                                    className="py-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={handleShowGrids}
                                    disabled={isButtonDisabled}
                                >
                                    Show Grids
                                </Button>

                                {userRole === 'admin' && (
                                    <Button
                                        className="py-4 rounded-xl 
                                                  text-white 
                                                  bg-gray-dark
                                                  data-[hover]:bg-gray 
                                                  data-[open]:bg-gray/700"
                                        onClick={handleResetGrids}
                                        disabled={isButtonDisabled}
                                    >
                                        reset
                                    </Button>
                                )}

                                <Button
                                    className="py-4 rounded-xl bg-white text-gray-light"
                                    onClick={handleClose}
                                    {...testId('close')}
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
