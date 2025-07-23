import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/InputLabel';
import { GridProps, HandleChange } from '@/types/templateEngine';
import HeadlineConfiguration from './HeadlineConfiguration';
import RangeSlider from './RangeSlider';

type Props = {
    handleChange: HandleChange;
    grid: GridProps;
};

const PaddingConfiguration = ({ handleChange, grid }: Props) => {
    return (
        <section data-testid="padding-configuration">
            <HeadlineConfiguration children="Padding" />
            <RangeSlider
                value={grid.paddingX}
                onChange={handleChange('paddingX')}
                placeholder="horizontal"
            >
                <InputLabel children="Horizontal: " />
            </RangeSlider>

            <RangeSlider
                value={grid.paddingY}
                onChange={handleChange('paddingY')}
                placeholder="vertical"
            >
                <InputLabel children="Vertical: " />
            </RangeSlider>
        </section>
    );
};

export default PaddingConfiguration;
