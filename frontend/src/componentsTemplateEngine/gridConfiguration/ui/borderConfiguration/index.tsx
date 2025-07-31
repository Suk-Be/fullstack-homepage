import StyledCheckbox from '@/componentsTemplateEngine/gridConfiguration/ui/borderConfiguration/StytledCheckbox';
import HeadlineAside from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/HeadlineAside';
import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/InputLabel';
import RangeSlider from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/RangeSlider';
import { GridProps, HandleChange, HandleToggle } from '@/types/templateEngine';
import { testId } from '@/utils/testId';

type Props = {
    toggled: boolean;
    handleChange: HandleChange;
    grid: GridProps;
    handleToggle: HandleToggle;
};

const BorderConfiguration = ({ toggled, handleChange, grid, handleToggle }: Props) => {
    return (
        <section {...testId('border-configuration')} id="border-configuration">
            <HeadlineAside children="Border" />

            <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <StyledCheckbox checked={toggled} onChange={handleToggle} />
                <RangeSlider
                    max="3"
                    value={grid.border}
                    onChange={handleChange('border')}
                    disabled={!toggled}
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
