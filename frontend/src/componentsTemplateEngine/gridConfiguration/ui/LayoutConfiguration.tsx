import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/InputLabel';
import { GridProps, HandleChange } from '@/types/templateEngine';
import HeadlineAside from './HeadlineAside';
import RangeSlider from './RangeSlider';

type Props = {
    handleChange: HandleChange;
    grid: GridProps;
};

const LayoutConfiguration = ({ handleChange, grid }: Props) => {
    return (
        <section data-testid="layout-configuration">
            <HeadlineAside children="Layout" />
            <RangeSlider
                max="30"
                value={grid.items}
                onChange={handleChange('items')}
                placeholder="items"
            >
                <InputLabel children="Items: " />
            </RangeSlider>
            <RangeSlider
                min="1"
                max="10"
                value={grid.columns}
                onChange={handleChange('columns')}
                placeholder="columns"
            >
                <InputLabel children="Columns: " />
            </RangeSlider>
        </section>
    );
};

export default LayoutConfiguration;
