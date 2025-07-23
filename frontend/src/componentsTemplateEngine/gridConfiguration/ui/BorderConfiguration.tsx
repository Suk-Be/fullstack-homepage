import HeadlineConfiguration from '@/componentsTemplateEngine/gridConfiguration/ui/HeadlineConfiguration';
import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/InputLabel';
import RangeSlider from '@/componentsTemplateEngine/gridConfiguration/ui/RangeSlider';
import StyledCheckbox from '@/componentsTemplateEngine/gridConfiguration/ui/StytledCheckbox';
import { GridProps, HandleChange, HandleToggle } from '@/types/templateEngine';
import Divider from './Divider';

type Props = {
    toggled: boolean;
    handleChange: HandleChange;
    grid: GridProps;
    handleToggle: HandleToggle;
};

// ... previous code remains the same
const BorderConfiguration = ({ toggled, handleChange, grid, handleToggle }: Props) => {
    return (
        <section data-testid="border-configuration" id="border-configuration">
            <HeadlineConfiguration children="Border" />
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

            <Divider />
        </section>
    );
};

export default BorderConfiguration;
