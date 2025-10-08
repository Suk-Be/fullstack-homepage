import { formatGridDate } from '@/componentsTemplateEngine/modals/SaveGridsModal/savedGridList/formatGridDate';
import { isGridNameUnique } from '@/componentsTemplateEngine/modals/SaveGridsModal/shared/IsGridNameUnique';
import { CancelSVG, CheckSVG } from '@/componentsTemplateEngine/svgs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSavedGridsMap, selectSortedGrids } from '@/store/selectors/userGridSelectors';
import { deleteThisGridThunk, renameThisGridThunk } from '@/store/thunks/userSaveGridsThunks';
import { applySavedGridToInitial } from '@/store/userSaveGridsSlice';
import { getAxiosStatus, logRecoverableError } from '@/utils/logger';
import { useRef, useState } from 'react';

const SavedGridList = () => {
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const savedGridsMap = useAppSelector(selectSavedGridsMap);
    const sortedGrids = useAppSelector(selectSortedGrids);
    const dispatch = useAppDispatch();

    // States für toggle (expand Config) & delete confirm pro Grid
    const [expandedConfigsText, setExpandedConfigsText] = useState<Record<string, boolean>>({});
    const [deleteConfirm, setDeleteConfirm] = useState<Record<string, boolean>>({});
    const [isDeletingMap, setIsDeletingMap] = useState<Record<string, boolean>>({});

    const [renaming, setRenaming] = useState<Record<string, boolean>>({});
    const [renameInput, setRenameInput] = useState<Record<string, string>>({});
    const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});

    // Event handlers
    const toggleConfigText = (id: string) => {
        setExpandedConfigsText((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const openDeleteOptions = (id: string) => {
        setDeleteConfirm((prev) => ({ ...prev, [id]: true }));
    };
    const cancelDelete = (id: string) => {
        setDeleteConfirm((prev) => ({ ...prev, [id]: false }));
    };

    const confirmApplyAction = async (id: string) => {
        try {
            dispatch(applySavedGridToInitial(id));
            // Optional: User Feedback oder Toast
            console.log(`Applied layout ${id} to initialLayoutId`);
        } catch (error) {
            logRecoverableError({
                context: '[Apply Layout] Failed to apply grid config',
                error,
                extra: { id },
            });
        }
    };

    const confirmDeleteAction = async (id: string) => {
        setIsDeletingMap((prev) => ({ ...prev, [id]: true }));
        try {
            await dispatch(deleteThisGridThunk(id)).unwrap();
        } catch (error) {
            const axiosStatus = getAxiosStatus(error);
            logRecoverableError({
                context: '[Delete Request] Failed to delete grid with id:',
                error,
                extra: { axiosStatus },
            });
        } finally {
            setIsDeletingMap((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleStartRename = (id: string, currentName: string) => {
        setRenaming((prev) => ({ ...prev, [id]: true }));
        setRenameInput((prev) => ({ ...prev, [id]: currentName }));
        setErrorMessage((prev) => ({ ...prev, [id]: '' }));

        // nach dem rendern
        setTimeout(() => {
            inputRefs.current[id]?.focus();
        }, 0);
    };

    const handleCancelRename = (id: string) => {
        setRenaming((prev) => ({ ...prev, [id]: false }));
        setErrorMessage((prev) => ({ ...prev, [id]: '' }));
    };

    const handleConfirmRename = async (id: string) => {
        const newName = renameInput[id]?.trim();

        if (
            !isGridNameUnique(newName, savedGridsMap, (msg) =>
                setErrorMessage((prev) => ({ ...prev, [id]: msg })),
            )
        ) {
            return;
        }

        try {
            await dispatch(renameThisGridThunk({ layoutId: id, newName })).unwrap();
            setRenaming((prev) => ({ ...prev, [id]: false }));
        } catch (error) {
            console.error('Rename error:', error);
            setErrorMessage((prev) => ({
                ...prev,
                [id]: 'Fehler beim Umbenennen der Grid-Konfiguration.',
            }));
        }
    };

    return (
        <div className="text-white mt-4 overflow-x-auto">
            <h3 className="font-bold mb-2  px-4 py-2">Your Saved Grids:</h3>

            {sortedGrids.length === 0 ? (
                <p className="italic text-gray-500">No grids saved yet.</p>
            ) : (
                <table className="table-fixed min-w-full border border-gray-700">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="px-4 py-2 text-left" colSpan={2}>
                                Name
                            </th>
                            <th className="px-4 py-2 text-left max-w-[200px]">Date</th>
                            <th className="px-4 py-2 text-left">Config</th>
                            <th className="px-4 py-2 text-left max-w-[200px]" colSpan={2}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedGrids.map((grid) => {
                            const isExpanded = expandedConfigsText[grid.layoutId];
                            const isDeleting = deleteConfirm[grid.layoutId];
                            const configText = JSON.stringify(grid.config, null, 2);

                            return (
                                <tr
                                    key={grid.layoutId}
                                    className="border-t border-gray-700 hover:bg-gray-900"
                                >
                                    <td className="px-4 py-2">{grid.name}</td>
                                    <td className="px-4 py-2">
                                        {renaming[grid.layoutId] ? (
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    type="text"
                                                    ref={(el) => {
                                                        inputRefs.current[grid.layoutId] = el;
                                                    }}
                                                    value={renameInput[grid.layoutId] || ''}
                                                    placeholder="name of the grid"
                                                    onChange={(e) =>
                                                        setRenameInput((prev) => ({
                                                            ...prev,
                                                            [grid.layoutId]: e.target.value,
                                                        }))
                                                    }
                                                    onFocus={() =>
                                                        setErrorMessage((prev) => ({
                                                            ...prev,
                                                            [grid.layoutId]: '',
                                                        }))
                                                    }
                                                    className="bg-gray-700 text-green-400 p-1 rounded"
                                                />
                                                {errorMessage[grid.layoutId] && (
                                                    <span className="text-green-400 text-sm">
                                                        {errorMessage[grid.layoutId]}
                                                    </span>
                                                )}

                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                                                        onClick={() =>
                                                            handleConfirmRename(grid.layoutId)
                                                        }
                                                    >
                                                        save
                                                    </button>
                                                    <button
                                                        className="text-green-500 hover:text-green-700 text-sm"
                                                        onClick={() =>
                                                            handleCancelRename(grid.layoutId)
                                                        }
                                                    >
                                                        cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                                                onClick={() =>
                                                    handleStartRename(grid.layoutId, grid.name)
                                                }
                                            >
                                                rename layout
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 w-[200px]">
                                        {formatGridDate(grid.timestamp)}
                                    </td>
                                    <td
                                        className={`px-4 py-2 font-mono cursor-pointer ${!isExpanded ? 'truncate max-w-[15vw]' : ''}`}
                                        title={!isExpanded ? 'show more' : ''}
                                        onClick={() => toggleConfigText(grid.layoutId)}
                                    >
                                        {configText}
                                    </td>
                                    <td className="px-4 py-2 w-[200px]">
                                        <button
                                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                                            onClick={() => confirmApplyAction(grid.layoutId)}
                                            title="Yes, apply"
                                        >
                                            apply layout
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 w-[200px]">
                                        {isDeleting ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-300">
                                                    really delete?
                                                </span>
                                                {/* yes Icon */}
                                                <button
                                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                                                    onClick={() =>
                                                        confirmDeleteAction(grid.layoutId)
                                                    }
                                                    title="Yes, delete"
                                                >
                                                    <CheckSVG />
                                                </button>
                                                {/* no Icon */}
                                                <button
                                                    className="text-green-500 hover:text-green-700"
                                                    onClick={() => cancelDelete(grid.layoutId)}
                                                    title="Cancel, delete"
                                                >
                                                    <CancelSVG />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                                                onClick={() => openDeleteOptions(grid.layoutId)}
                                                disabled={isDeletingMap[grid.layoutId]}
                                            >
                                                delete layout
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};
export default SavedGridList;
