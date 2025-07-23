import GridElement from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/GridElement';
import { twMerge } from 'tailwind-merge';

const simpleGridArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const makeSimpleGrid = (array: Array<number>) => (className: string) =>
    array.map((i) => {
        return <GridElement key={i.toString()} className={className} />;
    });

const SimpleGrid = ({ className }: { className?: string }) => {
    return (
        <div className={twMerge('grid grid-cols-3 xl:grid-cols-5 px-4 py-4', className)}>
            {makeSimpleGrid(simpleGridArray)('h-24 bg-gray-light')}
        </div>
    );
};

export default SimpleGrid;
