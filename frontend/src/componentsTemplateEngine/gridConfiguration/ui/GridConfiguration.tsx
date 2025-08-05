import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/InputLabel';
import { GridProps, HandleChange } from '@/types/templateEngine';
import { testId } from '@/utils/testId';
import HeadlineAside from './shared-comnponents/HeadlineAside';
import RangeSlider from './shared-comnponents/RangeSlider';

type Props = {
    handleChange: HandleChange;
    grid: GridProps;
};

const GridConfiguration = ({ handleChange, grid }: Props) => {
    return (
        <section {...testId('grid-configuration')}>
            <HeadlineAside children="Layout" />
            <RangeSlider
                min="1"
                max="10"
                value={grid.columns}
                onChange={handleChange('columns')}
                placeholder="columns"
            >
                <InputLabel children="Columns: " />
            </RangeSlider>
            <RangeSlider
                max="30"
                value={grid.items}
                onChange={handleChange('items')}
                placeholder="items"
            >
                <InputLabel children="Items: " />
            </RangeSlider>
        </section>
    );
};

export default GridConfiguration;
