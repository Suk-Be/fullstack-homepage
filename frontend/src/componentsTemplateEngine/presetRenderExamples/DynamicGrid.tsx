import GridElement from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/GridElement';
import { CSSProperties, FC } from 'react';

interface GridProps {
    style: CSSProperties;
    arr: number[];
}

const DynamicGridLayout: FC<GridProps> = ({ style, arr }) => {
    return (
        <div className="grid border-gray-light/25" style={style} data-testid="dynamic-layout">
            {arr.map((i) => (
                <GridElement
                    key={i.toString()}
                    id={i.toString()}
                    className="w-[32px] h-[24px] md:w-[84px] md:h-[61px] lg:w-[100px] lg:h-[75px] xl:w-32 xl:h-24 bg-gray rounded-sm md:rounded-xl"
                />
            ))}
        </div>
    );
};

export default DynamicGridLayout;
