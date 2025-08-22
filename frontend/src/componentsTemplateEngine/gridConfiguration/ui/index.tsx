import { GridProps, HandleChange, HandleToggle } from '@/types/templateEngine';
import { FC } from 'react';
import BorderConfiguration from './borderConfiguration';
import GapConfiguration from './GapConfiguration';
import GridConfiguration from './GridConfiguration';
import PaddingConfiguration from './PaddingConfiguration';
import HrInputs from './shared-comnponents/Divider';

const LayoutConfiguration: FC<{
    grid: GridProps;
    handleChange: HandleChange;
    checkBoxBorderToggled: boolean;
    handleCheckBoxBorderToggle: HandleToggle;
}> = ({ grid, handleChange, checkBoxBorderToggled, handleCheckBoxBorderToggle }) => {
    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-8">
                <GridConfiguration handleChange={handleChange} grid={grid} />

                <GapConfiguration handleChange={handleChange} grid={grid} />
            </div>

            <HrInputs />

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-8">
                <BorderConfiguration
                    checkBoxBorderToggled={checkBoxBorderToggled}
                    handleChange={handleChange}
                    grid={grid}
                    handleCheckBoxBorderToggle={handleCheckBoxBorderToggle}
                />

                <PaddingConfiguration handleChange={handleChange} grid={grid} />
            </div>
        </>
    );
};

export default LayoutConfiguration;
