import HeadlineAside from '@/componentsTemplateEngine/gridConfiguration/ui//shared-comnponents/HeadlineAside';
import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/InputLabel';
import RangeSlider from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/RangeSlider';
import UnitOfMeasurement from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/UnitOfMeasurement';
import { GridProps, HandleChange } from '@/types/templateEngine';
import { testId } from '@/utils/testId';

interface Props {
    handleChange: HandleChange;
    grid: GridProps;
}

const PaddingConfiguration = ({ handleChange, grid }: Props) => {
    return (
        <section {...testId('padding-configuration')}>
            <HeadlineAside>Grid Padding</HeadlineAside>
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
            <UnitOfMeasurement unit="fraction" numerator={1} denominator={2} />
        </section>
    );
};

export default PaddingConfiguration;
