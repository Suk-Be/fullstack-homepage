import InputLabel from '../../componentsTemplateEngine/gridConfiguration/InputLabel';
import { GridProps, HandleChange } from '../../types/templateEngine';
import Divider from './Divider';
import HeadlineConfiguration from './HeadlineConfiguration';
import RangeSlider from './RangeSlider';

type Props = {
    handleChange: HandleChange;
    grid: GridProps;
};

const GapConfiguration = ({ handleChange, grid }: Props) => {
    return (
        <section data-testid="gap-configuration">
            <HeadlineConfiguration children="Options" />

            <RangeSlider max="32" value={grid.gap} onChange={handleChange('gap')} placeholder="gap">
                <InputLabel children="Gap: " />
            </RangeSlider>

            <Divider />
        </section>
    );
};

export default GapConfiguration;
