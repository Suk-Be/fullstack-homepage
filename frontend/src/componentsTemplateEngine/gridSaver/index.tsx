import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addGrid } from '@/store/userSaveGridsSlice';
import { GridConfig } from '@/types/Redux';
import SavedGridList from './SavedGridList';

interface GridSaverProps {
    grid: GridConfig['config'];
}

const GridSaver = ({ grid }: GridSaverProps) => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.login.userId);
    // console.log('userId: ', userId);

    const handleSaveGrid = () => {
        if (!userId) {
            alert('User ID is not set. Cannot save grid.');
            return;
        }

        dispatch(addGrid({ config: grid }));
    };

    return (
        <div>
            {!userId && <p className="text-gray-700">User not loaded yet.</p>}
            <button
                onClick={handleSaveGrid}
                className="bg-green-600 text-white px-4 py-2 rounded"
                disabled={!userId}
            >
                Save Grid
            </button>
            <SavedGridList />
        </div>
    );
};

export default GridSaver;
