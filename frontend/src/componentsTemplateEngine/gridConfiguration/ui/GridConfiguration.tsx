import HeadlineAside from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/HeadlineAside';
import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/InputLabel';
import RangeSlider from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/RangeSlider';
import UnitOfMeasurement from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/UnitOfMeasurement';
import { GridProps, HandleChange } from '@/types/templateEngine';
import { testId } from '@/utils/testId';

interface Props {
    handleChange: HandleChange;
    grid: GridProps;
}

const GridConfiguration = ({ handleChange, grid }: Props) => {
    return (
        <section {...testId('grid-configuration')}>
            <HeadlineAside>Layout Grid</HeadlineAside>
            <RangeSlider
                min="1"
                max="10"
                value={grid.columns}
                onChange={handleChange('columns')}
                placeholder="columns"
            >
                <InputLabel>Columns: </InputLabel>
            </RangeSlider>
            <RangeSlider
                max="30"
                value={grid.items}
                onChange={handleChange('items')}
                placeholder="items"
            >
                <InputLabel>Items: </InputLabel>
            </RangeSlider>
            <UnitOfMeasurement unit="element" />
        </section>
    );
};

export default GridConfiguration;
