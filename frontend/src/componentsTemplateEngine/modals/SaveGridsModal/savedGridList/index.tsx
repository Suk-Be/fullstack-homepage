import Loading from '@/components/auth/auth-shared-components/Loading';
import { isGridNameUnique } from '@/componentsTemplateEngine/modals/SaveGridsModal/save-gridsmodal-shared/IsGridNameUnique';
import { formatGridDate } from '@/componentsTemplateEngine/modals/SaveGridsModal/savedGridList/formatGridDate';
import { CancelSVG, CheckSVG } from '@/componentsTemplateEngine/svgs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSavedGridsMap, selectSortedGrids } from '@/store/selectors/userGridSelectors';
import { deleteThisGridThunk, renameThisGridThunk } from '@/store/thunks/userSaveGridsThunks';
import { applySavedGridToInitial } from '@/store/userSaveGridsSlice';
import { getAxiosStatus, logRecoverableError } from '@/utils/logger';
import { sanitizeWithFeedback } from '@/utils/sanitizeInput';
import { buildGridRenderPropsFromConfig } from '@/utils/templateEngine/gridStyle';
import {
    copyGridMarkupToClipboard,
    renderGridMarkup,
} from '@/utils/templateEngine/markupClipboard';
import { useMemo, useRef, useState } from 'react';

const SavedGridList = () => {
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const savedGridsMap = useAppSelector(selectSavedGridsMap);
    const sortedGrids = useAppSelector(selectSortedGrids);
    const dispatch = useAppDispatch();

    // Actions
    const [expandedConfigsText, setExpandedConfigsText] = useState<Record<string, boolean>>({});
    const [deleteConfirm, setDeleteConfirm] = useState<Record<string, boolean>>({});
    const [isDeletingMap, setIsDeletingMap] = useState<Record<string, boolean>>({});
    const [renaming, setRenaming] = useState<Record<string, boolean>>({});
    const [renameInput, setRenameInput] = useState<Record<string, string>>({});
    const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});
    const [rowLoadingMap, setRowLoadingMap] = useState<Record<string, boolean>>({});
    const [showAllActions, setShowAllActions] = useState<Record<string, boolean>>({});
    const [appliedLayoutId, setAppliedLayoutId] = useState<string | null>(null);
    const [markupOpenMap, setMarkupOpenMap] = useState<Record<string, boolean>>({});
    const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
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
    const toggleActions = (id: string) => {
        setShowAllActions((p) => {
            const next = !p[id];

            if (!next) {
                setExpandedConfigsText((c) => ({ ...c, [id]: false }));
                setMarkupOpenMap((m) => ({ ...m, [id]: false }));
            }

            return { ...p, [id]: next };
        });
    };

    const toggleConfigText = (id: string) =>
        setExpandedConfigsText((p) => ({ ...p, [id]: !p[id] }));

    const closeConfig = (id: string) => {
        setExpandedConfigsText((p) => ({ ...p, [id]: false }));
    };

    const openDeleteOptions = (id: string) => setDeleteConfirm((p) => ({ ...p, [id]: true }));

    const cancelDelete = (id: string) => setDeleteConfirm((p) => ({ ...p, [id]: false }));

    const confirmApplyAction = (id: string) => {
        try {
            dispatch(applySavedGridToInitial(id));
            setAppliedLayoutId(id); // UI feedback setzen
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

    // renderMarkup
    // renderMarkup and copy HTML code
    const renderMarkupForGrid = (grid: any) => {
        const { inlineStyles, gridItemsArray } = buildGridRenderPropsFromConfig(grid.config);

        return renderGridMarkup(inlineStyles, gridItemsArray);
    };

    async function copyToClipboardForGrid(grid: any) {
        const { inlineStyles, gridItemsArray } = buildGridRenderPropsFromConfig(grid.config);

        await copyGridMarkupToClipboard(inlineStyles, gridItemsArray);

        setCopiedMap((p) => ({ ...p, [grid.layoutId]: true }));
        setTimeout(() => {
            setCopiedMap((p) => ({ ...p, [grid.layoutId]: false }));
        }, 750);
    }

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
                                onClick={() => handleSort('date')}
                                className={`px-4 py-2 text-left cursor-pointer select-none transition-colors duration-150 ${
                                    sortColumn === 'date'
                                        ? 'bg-blue-900 text-blue-300'
                                        : 'hover:bg-gray-700 text-white'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>Date</span>

                                    <span className="flex flex-col text-xs leading-none">
                                        {/* ▲ */}
                                        <span
                                            className={
                                                sortColumn === 'date' && sortDirection === 'asc'
                                                    ? 'text-white'
                                                    : 'text-gray-500'
                                            }
                                        >
                                            ▲
                                        </span>

                                        {/* ▼ */}
                                        <span
                                            className={
                                                sortColumn === 'date' && sortDirection === 'desc'
                                                    ? 'text-white'
                                                    : 'text-gray-500'
                                            }
                                        >
                                            ▼
                                        </span>
                                    </span>
                                </div>
                            </th>

                            <th
                                onClick={() => handleSort('name')}
                                className={`px-4 py-2 text-left cursor-pointer select-none transition-colors duration-150 ${
                                    sortColumn === 'name'
                                        ? 'bg-blue-900 text-blue-300'
                                        : 'hover:bg-gray-700 text-white'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>Name</span>

                                    <span className="flex flex-col text-xs leading-none">
                                        <span
                                            className={
                                                sortColumn === 'name' && sortDirection === 'asc'
                                                    ? 'text-white'
                                                    : 'text-gray-500'
                                            }
                                        >
                                            ▲
                                        </span>
                                        <span
                                            className={
                                                sortColumn === 'name' && sortDirection === 'desc'
                                                    ? 'text-white'
                                                    : 'text-gray-500'
                                            }
                                        >
                                            ▼
                                        </span>
                                    </span>
                                </div>
                            </th>

                            <th className="px-4 py-2 text-left max-w-[200px]">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedAndFilteredGrids.map((grid) => {
                            return (
                                <tr
                                    key={grid.layoutId}
                                    className="group border-t border-gray-700 
                                    odd:bg-gray-300
                                    even:bg-gray-100
                                    text-black
                                    hover:bg-gray-900
                                    hover:text-white"
                                >
                                    <td className="px-4 py-2 w-[200px]">
                                        {formatGridDate(grid.timestamp)}
                                    </td>
                                    <td className="px-4 py-2">{grid.name}</td>
                                    <td className="px-4 py-2 align-top">
                                        <div className="grid gap-2">
                                            {/* Row 1: Buttons */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                {/* Rename action (button OR save/cancel) */}
                                                {rowLoadingMap[grid.layoutId] ? (
                                                    <Loading
                                                        size={25}
                                                        height="auto"
                                                        textColor="common.white"
                                                        message="Saving..."
                                                    />
                                                ) : renaming[grid.layoutId] ? (
                                                    <>
                                                        <button
                                                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                                                            onClick={() => {
                                                                closeConfig(grid.layoutId);
                                                                handleConfirmRename(grid.layoutId);
                                                            }}
                                                        >
                                                            save
                                                        </button>
                                                        <button
                                                            className="px-2 py-1 text-gray-900 group-hover:text-gray-200 text-sm"
                                                            onClick={() => {
                                                                closeConfig(grid.layoutId);
                                                                handleCancelRename(grid.layoutId);
                                                            }}
                                                        >
                                                            cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                                                        onClick={() => {
                                                            closeConfig(grid.layoutId);
                                                            handleStartRename(
                                                                grid.layoutId,
                                                                grid.name,
                                                            );
                                                        }}
                                                    >
                                                        rename layout
                                                    </button>
                                                )}

                                                {/* Apply */}
                                                <button
                                                    className={`px-2 py-1 rounded text-white text-sm flex items-center gap-2 ${
                                                        appliedLayoutId === grid.layoutId
                                                            ? 'bg-blue-700'
                                                            : 'bg-blue-600 hover:bg-blue-700'
                                                    }`}
                                                    onClick={() => {
                                                        closeConfig(grid.layoutId);
                                                        confirmApplyAction(grid.layoutId);
                                                    }}
                                                    title="Yes, apply"
                                                >
                                                    {appliedLayoutId === grid.layoutId && (
                                                        <CheckSVG />
                                                    )}
                                                    {appliedLayoutId === grid.layoutId
                                                        ? 'applied layout'
                                                        : 'apply layout'}
                                                </button>

                                                {/* Delete */}
                                                {isDeletingMap[grid.layoutId] ? (
                                                    <Loading size={25} height="auto" message="" />
                                                ) : deleteConfirm[grid.layoutId] ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-900 group-hover:text-gray-200">
                                                            really delete?
                                                        </span>
                                                        <button
                                                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                                                            onClick={() => {
                                                                confirmDeleteAction(grid.layoutId);
                                                            }}
                                                            title="Yes, delete"
                                                        >
                                                            <CheckSVG />
                                                        </button>
                                                        <button
                                                            className="px-2 py-1 text-gray-900 group-hover:text-gray-200 text-sm"
                                                            onClick={() => {
                                                                cancelDelete(grid.layoutId);
                                                            }}
                                                            title="Cancel, delete"
                                                        >
                                                            <CancelSVG />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                                                        onClick={() => {
                                                            closeConfig(grid.layoutId);
                                                            handleCancelRename(grid.layoutId);
                                                            openDeleteOptions(grid.layoutId);
                                                        }}
                                                    >
                                                        delete layout
                                                    </button>
                                                )}

                                                {/* More/Less toggle: Row 3*/}
                                                <button
                                                    className="px-2 py-1 
                                                    text-gray-700 group-hover:text-white hover:text-white
                                                    text-sm flex items-center gap-1"
                                                    onClick={() => {
                                                        closeConfig(grid.layoutId);
                                                        handleCancelRename(grid.layoutId);
                                                        toggleActions(grid.layoutId);
                                                    }}
                                                >
                                                    <span
                                                        className={`
                                                          text-base leading-none
                                                          transition-transform duration-200 ease-in-out
                                                          ${showAllActions[grid.layoutId] ? 'rotate-180' : 'rotate-0'}
                                                        `}
                                                    >
                                                        ▸
                                                    </span>

                                                    <span>
                                                        {showAllActions[grid.layoutId]
                                                            ? 'less actions'
                                                            : 'more actions'}
                                                    </span>
                                                </button>
                                            </div>

                                            {/* Row 2: Rename input + error */}
                                            {renaming[grid.layoutId] && (
                                                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] items-center gap-3">
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
                                                        className="bg-gray-700 text-green-400 p-2 rounded w-full"
                                                    />

                                                    <div className="text-green-400 text-sm min-h-[1.25rem]">
                                                        {errorMessage[grid.layoutId] || ''}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Row 3: Markup actions + optional markup output */}
                                            {showAllActions[grid.layoutId] && (
                                                <div className="grid gap-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <button
                                                            className="px-3 py-2 bg-gray-900/80 hover:bg-gray-900 rounded text-white text-sm flex items-center gap-2"
                                                            onClick={() =>
                                                                copyToClipboardForGrid(grid)
                                                            }
                                                        >
                                                            {copiedMap[grid.layoutId]
                                                                ? 'Markup Is copied to Clipboard'
                                                                : 'Copy Markup to Clipboard'}
                                                        </button>

                                                        <button
                                                            className="px-3 py-2 bg-gray-900/80 hover:bg-gray-900 rounded text-white text-sm"
                                                            onClick={() =>
                                                                setMarkupOpenMap((p) => ({
                                                                    ...p,
                                                                    [grid.layoutId]:
                                                                        !p[grid.layoutId],
                                                                }))
                                                            }
                                                        >
                                                            {markupOpenMap[grid.layoutId]
                                                                ? 'Hide Markup'
                                                                : 'Show Markup'}
                                                        </button>

                                                        <button
                                                            className="px-3 py-2 bg-gray-900/80 hover:bg-gray-900 rounded text-white text-sm"
                                                            onClick={() =>
                                                                toggleConfigText(grid.layoutId)
                                                            }
                                                        >
                                                            {expandedConfigsText[grid.layoutId]
                                                                ? 'Hide CSS Configuration'
                                                                : 'Show CSS Configuration'}
                                                        </button>
                                                    </div>

                                                    {markupOpenMap[grid.layoutId] && (
                                                        <div className="bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2 overflow-auto">
                                                            <pre className="text-xs text-green-400 whitespace-pre-wrap">
                                                                {renderMarkupForGrid(grid)}
                                                            </pre>
                                                        </div>
                                                    )}

                                                    {expandedConfigsText[grid.layoutId] && (
                                                        <div className="bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2 overflow-auto">
                                                            <pre className="text-xs text-gray-200 whitespace-pre-wrap">
                                                                {JSON.stringify(grid.config)}
                                                            </pre>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
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
