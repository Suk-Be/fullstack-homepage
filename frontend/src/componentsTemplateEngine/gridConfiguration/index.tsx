import { GridProps, HandleChange, HandleToggle } from '../../types/templateEngine';
import { FC } from 'react';
import BorderConfiguration from './BorderConfiguration';
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
            <LayoutConfiguration handleChange={handleChange} grid={grid} />

            <GapConfiguration handleChange={handleChange} grid={grid} />

            <BorderConfiguration
                toggled={toggled}
                handleChange={handleChange}
                grid={grid}
                handleToggle={handleToggle}
            />

            <PaddingConfiguration handleChange={handleChange} grid={grid} />
        </section>
    );
};

export default GridConfiguration;
