import { formatGridDate } from '@/componentsTemplateEngine/modals/SaveGridsModal/savedGridList/formatGridDate';
import { CancelSVG, CheckSVG } from '@/componentsTemplateEngine/svgs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSortedGrids } from '@/store/selectors/userGridSelectors';
import { deleteThisGridThunk } from '@/store/userSaveGridsSlice';
import { useState } from 'react';

const SavedGridList = () => {
  const sortedGrids = useAppSelector(selectSortedGrids);
  const dispatch = useAppDispatch();

  // States für toggle (expand Config) & delete confirm pro Grid
  const [expandedConfigsText, setExpandedConfigsText] = useState<{ [key: string]: boolean }>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ [key: string]: boolean }>({});
  const [isDeletingMap, setIsDeletingMap] = useState<Record<string, boolean>>({});


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

  const confirmDeleteAction = async (id: string) => {
    setIsDeletingMap((prev) => ({ ...prev, [id]: true }));
    try {
      await dispatch(deleteThisGridThunk(id)).unwrap();
      alert('Grid erfolgreich gelöscht');
    } catch (err) {
      alert('Fehler beim Grid löschen: ' + err);
    } finally {
      setIsDeletingMap((prev) => ({ ...prev, [id]: false }));
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
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left max-w-[200px]">Date</th>
              <th className="px-4 py-2 text-left">Config</th>
              <th className="px-4 py-2 text-left max-w-[200px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedGrids.map((grid) => {
                const isExpanded = expandedConfigsText[grid.layoutId];
                const isDeleting = deleteConfirm[grid.layoutId];
                const configText = JSON.stringify(grid.config, null, 2);

                return (
                  <tr key={grid.layoutId} className="border-t border-gray-700 hover:bg-gray-900">
                    <td className="px-4 py-2">
                        {grid.name}
                    </td>
                    <td className="px-4 py-2 w-[200px]">
                        {formatGridDate(grid.timestamp)}
                    </td>
                    <td
                      className={`px-4 py-2 font-mono cursor-pointer ${!isExpanded ? "truncate max-w-[15vw]" : ""}`}
                      title={!isExpanded ? "show more" : ""}
                      onClick={() => toggleConfigText(grid.layoutId)}
                    >
                      {configText}
                    </td>
                    <td className="px-4 py-2 w-[200px]">
                        { isDeleting ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-300">really delete?</span>
                              {/* yes Icon */}
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => confirmDeleteAction(grid.layoutId)}
                                title="Yes, delete"
                              >
                                <CheckSVG />
                              </button>
                              {/* no Icon */}
                              <button
                                className="text-green-500 hover:text-green-700"
                                onClick={() => cancelDelete(grid.layoutId)}
                                title="Cancel"
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
                              delete
                            </button>
                          )
                        }
                    </td>
                  </tr>
                )
              }
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default SavedGridList;
