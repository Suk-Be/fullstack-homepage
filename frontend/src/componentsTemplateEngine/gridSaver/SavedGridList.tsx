import { useAppSelector } from '@/store/hooks';
import { selectSortedGrids } from '@/store/selectors/userGridSelectors';

const SavedGridList = () => {
    const sortedGrids = useAppSelector(selectSortedGrids);

    return (
        <div className="text-gray-700 mt-4">
            <h3 className="font-bold">Saved Grids:</h3>
            <ul className="text-sm">
                {sortedGrids.length === 0 ? (
                    <li className="italic text-gray-500">No grids saved yet.</li>
                ) : (
                    sortedGrids.map((grid) => (
                        <li key={grid.layoutId}>
                            <span className="font-semibold">
                                [{new Date(grid.timestamp).toLocaleString()}]
                            </span>{' '}
                            &rarr;{' '}
                            <span className="font-mono text-xs">{JSON.stringify(grid.config)}</span>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};
export default SavedGridList;
