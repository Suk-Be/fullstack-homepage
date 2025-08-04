import GridElement from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/GridElement';
import { testId } from '@/utils/testId';

const RowspanningGrid = () => {
    return (
        <div
            className="grid grid-rows-3 grid-flow-col gap-4 px-4 py-4 leading-10"
            {...testId('row-spannning-grid-container')}
        >
            <GridElement className=" p-12 bg-green-dark row-span-3" />
            <GridElement className="p-12 bg-green col-span-2" />
            <GridElement className="p-12 bg-green-dark/80 row-span-2 col-span-2" />
        </div>
    );
};

export default RowspanningGrid;
