import GridElement from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/GridElement';
import { twMerge } from 'tailwind-merge';

const ColspanningGrid = ({ className }: { className: string }) => {
    return (
        <div className="grid grid-cols-3 xl:grid-cols-3 gap-4 px-4 py-4">
            <GridElement className="h-24 bg-green-dark" />
            <GridElement className={twMerge('h-24 bg-green', className)} />

            <GridElement className={twMerge('h-24 bg-green', className)} />
            <GridElement className="h-24 bg-green-dark" />

            <GridElement className="h-24 bg-green-dark" />
            <GridElement className={twMerge('h-24 bg-green', className)} />
        </div>
    );
};

export default ColspanningGrid;
