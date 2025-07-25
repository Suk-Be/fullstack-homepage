import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/InputLabel';
import { GridProps, HandleChange } from '@/types/templateEngine';
import HeadlineAside from './HeadlineAside';
import RangeSlider from './RangeSlider';

type Props = {
    handleChange: HandleChange;
    grid: GridProps;
};

const GapConfiguration = ({ handleChange, grid }: Props) => {
    return (
        <section data-testid="gap-configuration">
            <HeadlineAside children="Options" />
            <RangeSlider max="7" value={grid.gap} onChange={handleChange('gap')} placeholder="gap">
                <InputLabel children="Gap: " />
            </RangeSlider>
            Unit: px
        </section>
    );
};

export default GapConfiguration;
