import GridElement from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/GridElement';
import { testId } from '@/utils/testId';
import { twMerge } from 'tailwind-merge';

const gridItemsAmount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const makeGridItems = (array: number[]) => (layoutGapConfig: string) =>
    array.map((i) => {
        return <GridElement key={i.toString()} className={layoutGapConfig} />;
    });

const SimpleGrid = ({ layoutGapConfig }: { layoutGapConfig?: string }) => {
    return (
        <div
            className={twMerge('grid grid-cols-3 xl:grid-cols-5 px-4 py-4', layoutGapConfig)}
            {...testId('grid-container')}
        >
            {makeGridItems(gridItemsAmount)('h-24 bg-gray-light')}
        </div>
    );
};

export default SimpleGrid;
