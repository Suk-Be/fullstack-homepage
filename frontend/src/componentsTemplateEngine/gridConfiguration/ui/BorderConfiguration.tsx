import HeadlineAside from '@/componentsTemplateEngine/gridConfiguration/ui/HeadlineAside';
import InputLabel from '@/componentsTemplateEngine/gridConfiguration/ui/InputLabel';
import RangeSlider from '@/componentsTemplateEngine/gridConfiguration/ui/RangeSlider';
import StyledCheckbox from '@/componentsTemplateEngine/gridConfiguration/ui/StytledCheckbox';
import { GridProps, HandleChange, HandleToggle } from '@/types/templateEngine';

type Props = {
    toggled: boolean;
    handleChange: HandleChange;
    grid: GridProps;
    handleToggle: HandleToggle;
};

const BorderConfiguration = ({ toggled, handleChange, grid, handleToggle }: Props) => {
    return (
        <section data-testid="border-configuration" id="border-configuration">
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
            </div>
        </section>
    );
};

export default BorderConfiguration;
