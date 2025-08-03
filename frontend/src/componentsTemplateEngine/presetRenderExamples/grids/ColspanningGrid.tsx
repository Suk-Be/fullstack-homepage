import GridElement from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/GridElement';
import { testId } from '@/utils/testId';
import { twMerge } from 'tailwind-merge';

const ColspanningGrid = ({ layoutConfig }: { layoutConfig: string }) => {
    return (
        <div
            className="grid grid-cols-3 xl:grid-cols-3 gap-4 px-4 py-4"
            {...testId('col-spannning-grid-container')}
        >
            <GridElement className="h-24 bg-green-dark" />
            <GridElement className={twMerge('h-24 bg-green', layoutConfig)} />

            <GridElement className={twMerge('h-24 bg-green', layoutConfig)} />
            <GridElement className="h-24 bg-green-dark" />

            <GridElement className="h-24 bg-green-dark" />
            <GridElement className={twMerge('h-24 bg-green', layoutConfig)} />
        </div>
    );
};

export default ColspanningGrid;
