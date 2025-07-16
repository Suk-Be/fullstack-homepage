import HeadlineConfiguration from '../../componentsTemplateEngine/gridConfiguration/HeadlineConfiguration';
import InputLabel from '../../componentsTemplateEngine/gridConfiguration/InputLabel';
import RangeSlider from '../../componentsTemplateEngine/gridConfiguration/RangeSlider';
import StyledCheckbox from '../../componentsTemplateEngine/gridConfiguration/StytledCheckbox';
import { GridProps, HandleChange, HandleToggle } from '../../types/templateEngine';
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
