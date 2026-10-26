import StyledCheckbox from '@/componentsTemplateEngine/gridConfigurations/ui/borderConfiguration/StyledCheckbox';
import HeadlineAside from '@/componentsTemplateEngine/gridConfigurations/ui/ui-shared-comnponents/HeadlineAside';
import InputLabel from '@/componentsTemplateEngine/gridConfigurations/ui/ui-shared-comnponents/InputLabel';
import RangeSlider from '@/componentsTemplateEngine/gridConfigurations/ui/ui-shared-comnponents/RangeSlider';
import UnitOfMeasurement from '@/componentsTemplateEngine/gridConfigurations/ui/ui-shared-comnponents/UnitOfMeasurement';
import { GridProps, HandleChange, HandleToggle } from '@/types/templateEngine';
import { testId } from '@/utils/testId';

export interface Props {
    checkBoxBorderToggled: boolean;
    handleChange: HandleChange;
    grid: GridProps;
    handleCheckBoxBorderToggle: HandleToggle;
}

const BorderConfiguration = ({
    checkBoxBorderToggled,
    handleChange,
    grid,
    handleCheckBoxBorderToggle,
}: Props) => {
    return (
        <section {...testId('border-configuration')} id="border-configuration">
            <HeadlineAside>Grid Border</HeadlineAside>

            <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <StyledCheckbox
                    checked={checkBoxBorderToggled}
                    onChange={handleCheckBoxBorderToggle}
                />
                <RangeSlider
                    max="3"
                    value={grid.border}
                    onChange={handleChange('border')}
                    disabled={!checkBoxBorderToggled}
                    placeholder="border"
                >
                    <InputLabel htmlFor="border">Width: </InputLabel>
                </RangeSlider>
                <UnitOfMeasurement unit="fraction" numerator={1} denominator={3} />
            </div>
        </section>
    );
};

export default BorderConfiguration;
