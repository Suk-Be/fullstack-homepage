import StyledCheckbox from '@/componentsTemplateEngine/gridConfiguration/ui/borderConfiguration/StyledCheckbox';
import HeadlineAside from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/HeadlineAside';
import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/InputLabel';
import RangeSlider from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/RangeSlider';
import { GridProps, HandleChange, HandleToggle } from '@/types/templateEngine';
import { testId } from '@/utils/testId';

export type Props = {
    checkBoxBorderToggled: boolean;
    handleChange: HandleChange;
    grid: GridProps;
    handleCheckBoxBorderToggle: HandleToggle;
};

const BorderConfiguration = ({ checkBoxBorderToggled, handleChange, grid, handleCheckBoxBorderToggle }: Props) => {
    return (
        <section {...testId('border-configuration')} id="border-configuration">
            <HeadlineAside children="Border" />

            <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <StyledCheckbox checked={checkBoxBorderToggled} onChange={handleCheckBoxBorderToggle} />
                <RangeSlider
                    max="3"
                    value={grid.border}
                    onChange={handleChange('border')}
                    disabled={!checkBoxBorderToggled}
                    placeholder="border"
                >
                    <InputLabel children="Width: " htmlFor="border" />
                </RangeSlider>
                Unit: rem/3
            </div>
        </section>
    );
};

export default BorderConfiguration;
