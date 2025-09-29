import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/InputLabel';
import { GridProps, HandleChange } from '@/types/templateEngine';
import { testId } from '@/utils/testId';
import HeadlineAside from './shared-comnponents/HeadlineAside';
import RangeSlider from './shared-comnponents/RangeSlider';

interface Props {
    handleChange: HandleChange;
    grid: GridProps;
}

const GridConfiguration = ({ handleChange, grid }: Props) => {
    return (
        <section {...testId('grid-configuration')}>
            <HeadlineAside>Layout</HeadlineAside>
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
        </section>
    );
};

export default GridConfiguration;
