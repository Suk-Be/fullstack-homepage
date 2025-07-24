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
                    className="w-32 h-24 bg-gray rounded-xl"
                />
            ))}
        </div>
    );
};

export default DynamicGridLayout;
