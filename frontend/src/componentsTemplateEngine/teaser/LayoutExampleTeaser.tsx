import GridElement from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/GridElement';
import { testId } from '@/utils/testId';

const LayoutExampleTeaser = () => {
    return (
        <div
            className="grid grid-cols-3 xl:grid-cols-3 gap-2 py-4 group-hover:scale-[1.02] transition-all transform"
            role="img"
            aria-label="presets-grid-image"
            {...testId('grid-eample-teaser')}
        >
            <GridElement className="w-full h-12 rounded-xl bg-green-dark shadow-inner shadow-white/50 group-focus:outline-none group-focus:outline-1 group-focus:outline-white" />
            <GridElement className="w-full h-12 rounded-xl col-span-2 bg-green shadow-inner shadow-white/90 group-focus:outline-none group-focus:outline-1 group-focus:outline-white" />

            <GridElement className="w-full h-12 rounded-xl col-span-2 bg-green shadow-inner shadow-white/90 group-focus:outline-none group-focus:outline-1 group-focus:outline-white" />
            <GridElement className="w-full h-12 rounded-xl bg-green-dark shadow-inner shadow-white/50 group-focus:outline-none group-focus:outline-1 group-focus:outline-white" />

            <GridElement className="w-full h-12 rounded-xl bg-green-dark shadow-inner shadow-white/50 group-focus:outline-none group-focus:outline-1 group-focus:outline-white" />
            <GridElement className="w-full h-12 rounded-xl col-span-2 bg-green shadow-inner shadow-white/90 group-focus:outline-none group-focus:outline-1 group-focus:outline-white" />
        </div>
    );
};

export default LayoutExampleTeaser;
