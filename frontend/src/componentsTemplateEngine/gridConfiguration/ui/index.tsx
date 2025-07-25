import { GridProps, HandleChange, HandleToggle } from '@/types/templateEngine';
import { FC } from 'react';
import BorderConfiguration from './BorderConfiguration';
import HrInputs from './Divider';
import GapConfiguration from './GapConfiguration';
import LayoutConfiguration from './LayoutConfiguration';
import PaddingConfiguration from './PaddingConfiguration';

const GridConfiguration: FC<{
    grid: GridProps;
    handleChange: HandleChange;
    toggled: boolean;
    handleToggle: HandleToggle;
}> = ({ grid, handleChange, toggled, handleToggle }) => {
    return (
        <section>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-8">
                <LayoutConfiguration handleChange={handleChange} grid={grid} />

                <GapConfiguration handleChange={handleChange} grid={grid} />
            </div>

            <HrInputs />

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-8">
                <BorderConfiguration
                    toggled={toggled}
                    handleChange={handleChange}
                    grid={grid}
                    handleToggle={handleToggle}
                />

                <PaddingConfiguration handleChange={handleChange} grid={grid} />
            </div>
        </section>
    );
};

export default GridConfiguration;
