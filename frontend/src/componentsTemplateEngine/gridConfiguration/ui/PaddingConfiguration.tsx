import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/InputLabel';
import { GridProps, HandleChange } from '@/types/templateEngine';
import { testId } from '@/utils/testId';
import HeadlineAside from './shared-comnponents/HeadlineAside';
import RangeSlider from './shared-comnponents/RangeSlider';

interface Props {
    handleChange: HandleChange;
    grid: GridProps;
}

const PaddingConfiguration = ({ handleChange, grid }: Props) => {
    return (
        <section {...testId('padding-configuration')}>
            <HeadlineAside>Padding</HeadlineAside>
            <RangeSlider
                max="5"
                value={grid.paddingX}
                onChange={handleChange('paddingX')}
                placeholder="horizontal"
            >
                <InputLabel>Horizontal: </InputLabel>
            </RangeSlider>
            <RangeSlider
                max="5"
                value={grid.paddingY}
                onChange={handleChange('paddingY')}
                placeholder="vertical"
            >
                <InputLabel>Vertical: </InputLabel>
            </RangeSlider>
            Unit: rem/2
        </section>
    );
};

export default PaddingConfiguration;
