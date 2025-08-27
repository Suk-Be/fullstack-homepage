import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/InputLabel';
import { GridProps, HandleChange } from '@/types/templateEngine';
import { testId } from '@/utils/testId';
import HeadlineAside from './shared-comnponents/HeadlineAside';
import RangeSlider from './shared-comnponents/RangeSlider';

type Props = {
    handleChange: HandleChange;
    grid: GridProps;
};

const GapConfiguration = ({ handleChange, grid }: Props) => {
    return (
        <section {...testId('gap-configuration')}>
            <HeadlineAside children="Options" />
            <RangeSlider max="7" value={grid.gap} onChange={handleChange('gap')} placeholder="gap">
                <InputLabel children="Gap: " />
            </RangeSlider>
            Unit: px
        </section>
    );
};

export default GapConfiguration;
