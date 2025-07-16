import { decrement, increment } from '../../store/counterSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export function ReduxCounter() {
    const count = useAppSelector((state) => state.counter.value);
    const dispatch = useAppDispatch();

    return (
        <div>
            <div className="flex flex-col">
                <button
                    aria-label="Increment value"
                    onClick={() => dispatch(increment())}
                    className="bg-green rounded-xl p-1 text-white"
                >
                    Increment
                </button>
                <span className="text-center rounded-xl p-1">{count}</span>
                <button
                    aria-label="Decrement value"
                    onClick={() => dispatch(decrement())}
                    className="bg-green rounded-xl p-1 text-white"
                >
                    Decrement
                </button>
            </div>
        </div>
    );
}
