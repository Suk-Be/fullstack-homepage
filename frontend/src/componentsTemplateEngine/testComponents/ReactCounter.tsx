import { useState, FC } from 'react';

const ReactCounter: FC = () => {
    const [count, setCount] = useState(0);

    // ✅ Can pass an "updater" function to setState,
    // which gets the latest value as its argument
    const clickHandlerFixed = () => {
        setCount((prevCounter) => prevCounter + 1);
        setCount((prevCounter) => prevCounter + 1);
    };

    // ❌ Two bugs here!
    // 1) "Closed over" old value of `counter`
    // 2) Updates will be batched together
    const onClickBuggy = () => {
        setCount(count + 1);
        setCount(count + 1);
    };

    return (
        <div>
            <div className="flex flex-col">
                <button
                    aria-label="Increment value"
                    onClick={clickHandlerFixed}
                    className="bg-green rounded-xl p-1 text-white"
                >
                    fixed increment by 2
                </button>
                <span className="text-center rounded-xl p-1">{count}</span>
                <button
                    aria-label="Decrement value"
                    onClick={onClickBuggy}
                    className="bg-green rounded-xl p-1 text-white"
                >
                    buggy increment by 2
                </button>
            </div>
        </div>
    );
};

export default ReactCounter;
