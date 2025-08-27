import GridElement from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/GridElement';
import { testId } from '@/utils/testId';
import { CSSProperties, FC } from 'react';

interface GridProps {
    style: CSSProperties;
    arr: number[];
}

const CreateGridLayout: FC<GridProps> = ({ style, arr }) => {
    return (
        <div className="grid border-gray-light/25" style={style} {...testId('dynamic-grid')}>
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

export default CreateGridLayout;
