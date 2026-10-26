import HeadlineAside from '@/componentsTemplateEngine/gridConfigurations/ui/ui-shared-comnponents/HeadlineAside';
import InputLabel from '@/componentsTemplateEngine/gridConfigurations/ui/ui-shared-comnponents/InputLabel';
import RangeSlider from '@/componentsTemplateEngine/gridConfigurations/ui/ui-shared-comnponents/RangeSlider';
import UnitOfMeasurement from '@/componentsTemplateEngine/gridConfigurations/ui/ui-shared-comnponents/UnitOfMeasurement';
import { GridProps, HandleChange } from '@/types/templateEngine';
import { testId } from '@/utils/testId';

interface Props {
    handleChange: HandleChange;
    grid: GridProps;
}

const GapConfiguration = ({ handleChange, grid }: Props) => {
    return (
        <section {...testId('gap-configuration')}>
            <HeadlineAside>Element Spacing</HeadlineAside>
            <RangeSlider max="7" value={grid.gap} onChange={handleChange('gap')} placeholder="gap">
                <InputLabel>Gap: </InputLabel>
            </RangeSlider>
            <UnitOfMeasurement unit="px" />
        </section>
    );
};

export default GapConfiguration;
