import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/InputLabel';
import { GridProps, HandleChange } from '@/types/templateEngine';
import { testId } from '@/utils/testId';
import HeadlineAside from './shared-comnponents/HeadlineAside';
import RangeSlider from './shared-comnponents/RangeSlider';

interface Props {
    handleChange: HandleChange;
    grid: GridProps;
}

const GapConfiguration = ({ handleChange, grid }: Props) => {
    return (
        <section {...testId('gap-configuration')}>
            <HeadlineAside>Options</HeadlineAside>
            <RangeSlider max="7" value={grid.gap} onChange={handleChange('gap')} placeholder="gap">
                <InputLabel>Gap: </InputLabel>
            </RangeSlider>
            Unit: px
        </section>
    );
};

export default GapConfiguration;
