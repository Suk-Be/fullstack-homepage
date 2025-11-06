import Loading from '@/components/auth/shared-components/Loading';
import { formatGridDate } from '@/componentsTemplateEngine/modals/SaveGridsModal/savedGridList/formatGridDate';
import { isGridNameUnique } from '@/componentsTemplateEngine/modals/SaveGridsModal/shared/IsGridNameUnique';
import { CancelSVG, CheckSVG } from '@/componentsTemplateEngine/svgs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSavedGridsMap, selectSortedGrids } from '@/store/selectors/userGridSelectors';
import { deleteThisGridThunk, renameThisGridThunk } from '@/store/thunks/userSaveGridsThunks';
import { applySavedGridToInitial } from '@/store/userSaveGridsSlice';
import { getAxiosStatus, logRecoverableError } from '@/utils/logger';
import { sanitizeWithFeedback } from '@/utils/sanitizeInput';
import { useMemo, useRef, useState } from 'react';

const SavedGridList = () => {
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const savedGridsMap = useAppSelector(selectSavedGridsMap);
    const sortedGrids = useAppSelector(selectSortedGrids);
    const dispatch = useAppDispatch();

    const [expandedConfigsText, setExpandedConfigsText] = useState<Record<string, boolean>>({});
    const [deleteConfirm, setDeleteConfirm] = useState<Record<string, boolean>>({});
    const [isDeletingMap, setIsDeletingMap] = useState<Record<string, boolean>>({});
    const [renaming, setRenaming] = useState<Record<string, boolean>>({});
    const [renameInput, setRenameInput] = useState<Record<string, string>>({});
    const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});
    const [rowLoadingMap, setRowLoadingMap] = useState<Record<string, boolean>>({});

    // Sortierung
    const [sortColumn, setSortColumn] = useState<'name' | 'date'>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const handleSort = (column: 'name' | 'date') => {
        if (sortColumn === column) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('desc');
        }
    };

    const sortedAndFilteredGrids = useMemo(() => {
        const grids = [...sortedGrids];
        return grids.sort((a, b) => {
            if (sortColumn === 'name') {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (nameA < nameB) return sortDirection === 'asc' ? -1 : 1;
                if (nameA > nameB) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            }
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [sortedGrids, sortColumn, sortDirection]);

    // Handlers
    const toggleConfigText = (id: string) =>
        setExpandedConfigsText((p) => ({ ...p, [id]: !p[id] }));

    const openDeleteOptions = (id: string) => setDeleteConfirm((p) => ({ ...p, [id]: true }));

    const cancelDelete = (id: string) => setDeleteConfirm((p) => ({ ...p, [id]: false }));

    const confirmApplyAction = (id: string) => {
        try {
            dispatch(applySavedGridToInitial(id));
        } catch (error) {
            logRecoverableError({
                context: '[Apply Layout] Failed to apply grid config',
                error,
                extra: { id },
            });
        }
    };

    const confirmDeleteAction = async (id: string) => {
        setIsDeletingMap((p) => ({ ...p, [id]: true }));
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
            setIsDeletingMap((p) => ({ ...p, [id]: false }));
        }
    };

    const handleStartRename = (id: string, currentName: string) => {
        setRenaming((p) => ({ ...p, [id]: true }));
        setRenameInput((p) => ({ ...p, [id]: currentName }));
        setErrorMessage((p) => ({ ...p, [id]: '' }));
        setTimeout(() => inputRefs.current[id]?.focus(), 0);
    };

    const handleCancelRename = (id: string) => {
        setRenaming((p) => ({ ...p, [id]: false }));
        setErrorMessage((p) => ({ ...p, [id]: '' }));
    };

    const handleConfirmRename = async (id: string) => {
        const rawName = renameInput[id] ?? '';
        const sanitizedGridRename = sanitizeWithFeedback({
            value: rawName,
            setValue: (val) => setRenameInput((p) => ({ ...p, [id]: val })),
            setError: (msg) => setErrorMessage((p) => ({ ...p, [id]: msg })),
        });
        if (sanitizedGridRename) return;
        if (
            !isGridNameUnique(renameInput[id]!, savedGridsMap, (msg) =>
                setErrorMessage((p) => ({ ...p, [id]: msg })),
            )
        )
            return;

        setRowLoadingMap((p) => ({ ...p, [id]: true }));
        try {
            await dispatch(
                renameThisGridThunk({ layoutId: id, newName: renameInput[id]! }),
            ).unwrap();
            setRenaming((p) => ({ ...p, [id]: false }));
        } catch {
            setErrorMessage((p) => ({
                ...p,
                [id]: 'Error renaming this grid layout.',
            }));
        } finally {
            setRowLoadingMap((p) => ({ ...p, [id]: false }));
        }
    };

    return (
        <div className="text-white mt-4 overflow-x-auto">
            <h3 className="font-bold mb-2 px-4 py-2">Your Saved Grids:</h3>

            {sortedAndFilteredGrids.length === 0 ? (
                <p className="italic text-gray-500">No grids saved yet.</p>
            ) : (
                <table className="table-fixed min-w-full border border-gray-700">
                    <thead>
                        <tr className="bg-gray-800">
                            <th
                                onClick={() => handleSort('name')}
                                className={`px-4 py-2 text-left cursor-pointer select-none transition-colors duration-150 ${
                                    sortColumn === 'name'
                                        ? 'bg-blue-900 text-blue-300'
                                        : 'hover:bg-gray-700'
                                }`}
                                colSpan={2}
                            >
                                <div className="flex items-center gap-2">
                                    Name
                                    <span
                                        className={`transition-transform ${
                                            sortColumn === 'name' && sortDirection === 'asc'
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    >
                                        {sortColumn === 'name' ? '▼' : ''}
                                    </span>
                                </div>
                            </th>

                            <th
                                onClick={() => handleSort('date')}
                                className={`px-4 py-2 text-left cursor-pointer select-none transition-colors duration-150 ${
                                    sortColumn === 'date'
                                        ? 'bg-blue-900 text-blue-300'
                                        : 'hover:bg-gray-700'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    Date
                                    <span
                                        className={`transition-transform ${
                                            sortColumn === 'date' && sortDirection === 'asc'
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    >
                                        {sortColumn === 'date' ? '▼' : ''}
                                    </span>
                                </div>
                            </th>

                            <th className="px-4 py-2 text-left">Config</th>
                            <th className="px-4 py-2 text-left max-w-[200px]" colSpan={2}>
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedAndFilteredGrids.map((grid) => {
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
                                        {rowLoadingMap[grid.layoutId] ? (
                                            <Loading
                                                size={25}
                                                height="auto"
                                                textColor="common.white"
                                                message="Saving..."
                                            />
                                        ) : renaming[grid.layoutId] ? (
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    ref={(el) => {
                                                        inputRefs.current[grid.layoutId] = el;
                                                    }}
                                                    value={renameInput[grid.layoutId] || ''}
                                                    placeholder="name of the grid"
                                                    onChange={(e) =>
                                                        setRenameInput((p) => ({
                                                            ...p,
                                                            [grid.layoutId]: e.target.value,
                                                        }))
                                                    }
                                                    onFocus={() =>
                                                        setErrorMessage((p) => ({
                                                            ...p,
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
                                        className={`px-4 py-2 font-mono cursor-pointer ${
                                            !isExpanded ? 'truncate max-w-[15vw]' : ''
                                        }`}
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
                                        {isDeletingMap[grid.layoutId] ? (
                                            <Loading size={25} height="auto" message="" />
                                        ) : isDeleting ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-300">
                                                    really delete?
                                                </span>
                                                <button
                                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                                                    onClick={() =>
                                                        confirmDeleteAction(grid.layoutId)
                                                    }
                                                    title="Yes, delete"
                                                >
                                                    <CheckSVG />
                                                </button>
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
