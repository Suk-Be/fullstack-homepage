import { useAppSelector } from '@/store/hooks';
import { selectSortedGrids } from '@/store/selectors/userGridSelectors';

const SavedGridList = () => {
  const sortedGrids = useAppSelector(selectSortedGrids);


  return (
    <div className="text-white mt-4 overflow-x-auto">
      <h3 className="font-bold mb-2  px-4 py-2">Your Saved Grids:</h3>

      {sortedGrids.length === 0 ? (
        <p className="italic text-gray-500">No grids saved yet.</p>
      ) : (
        <table className="table-auto md:table-fixed min-w-full border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Config</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedGrids.map((grid) => (
              <tr key={grid.layoutId} className="border-t border-gray-700 hover:bg-gray-900">
                <td className="px-4 py-2">{grid.name}</td>
                <td className="px-4 py-2">{new Date(grid.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 font-mono">
                  {JSON.stringify(grid.config)
                  .slice(1, -1)
                  .replace(/,/g, ', ')}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                    onClick={() => console.log('Action for', grid.layoutId)}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default SavedGridList;
