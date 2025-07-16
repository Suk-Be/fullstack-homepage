import { FC, useState, PropsWithoutRef } from 'react';

type speaker = string;

type ListRendererProps = { allSpeakers: speaker[] };

export const allSpeakers = [
    'Scott Hanselman',
    'John Papa',
    'Scott Guthrie',
    'Dan Wahlin',
    'Debora Kurata',
    'Zoiner Tejada',
    'Scott Allen',
    'Elijah Manor',
    'Ward Bell',
    'Todd Anglin',
    'Saron Yitbare',
    'Scott Hunter',
];

const ListRenderer: FC<PropsWithoutRef<ListRendererProps>> = ({
    allSpeakers,
}: ListRendererProps) => {
    const [shouldSort, setShouldSort] = useState(false);
    const [filter, setFilter] = useState('');

    const onSortClicked = () => {
        setShouldSort(true);
    };

    const onScottClicked = () => {
        setFilter('Scott');
    };

    const onResetClicked = () => {
        setShouldSort(false);
        setFilter('');
    };

    let speakersToDisplay = allSpeakers;

    // Prefer deriving data while rendering, vs storing derived values
    if (filter) {
        speakersToDisplay = speakersToDisplay.filter((name) => name.startsWith(filter));
    }

    if (shouldSort) {
        speakersToDisplay = speakersToDisplay.slice().sort();
    }

    const speakerListItems = speakersToDisplay.map((speaker: speaker) => (
        <li key={speaker}>{speaker}</li>
    ));

    return (
        <div className="flex flex-col gap-4 border-8 border-gray-light p-4 mt-4">
            <div className="flex justify-center gap-4">
                <button
                    onClick={onSortClicked}
                    className="bg-blue-500 hover:bg-blue-700 active:bg-blue-900 text-white font-bold py-2 px-4 rounded"
                >
                    Sort
                </button>
                <button
                    onClick={onScottClicked}
                    className="bg-blue-500 hover:bg-blue-700 active:bg-blue-900 text-white font-bold py-2 px-4 rounded"
                >
                    Scott
                </button>
                <button
                    onClick={onResetClicked}
                    className="bg-blue-500 hover:bg-blue-700 active:bg-blue-900 text-white font-bold py-2 px-4 rounded"
                >
                    Reset
                </button>
            </div>

            <ul className="columns-3">{speakerListItems}</ul>
        </div>
    );
};

export default ListRenderer;
