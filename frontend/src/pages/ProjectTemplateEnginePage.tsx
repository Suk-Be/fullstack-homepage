import AsideLeft from '@/componentsTemplateEngine/containers/layoutConfigurator/AsideLeft';
import AsideRight from '@/componentsTemplateEngine/containers/layoutConfigurator/AsideRight';
import ContentCenter from '@/componentsTemplateEngine/containers/layoutConfigurator/ContentCenter';
import MainContainer from '@/componentsTemplateEngine/containers/layoutConfigurator/MainContainer';
import GridConfiguration from '@/componentsTemplateEngine/gridConfiguration';
import DynamicGridLayout from '@/componentsTemplateEngine/gridLayout/layoutPresets/DynamicGrid';
import ExportDynamicCodeTeaser from '@/componentsTemplateEngine/gridLayout/markupGeneratorDynamic';
import TeaserPresetsPage from '@/componentsTemplateEngine/teaserPresetsPage';
import { testId } from '@/utils/testId';
import { ChangeEvent, FC, useState } from 'react';
import '../ProjectTemplateEnginePage.css';

const ProjectTemplateEnginePage: FC = () => {
    const [grid, setGrid] = useState({
        items: '1',
        columns: '1',
        gap: '0',
        border: '0',
        paddingX: '0',
        paddingY: '0',
    });

    const handleChange = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
        setGrid({
            ...grid,
            [key]: +e.target.value,
        });
    };

    const handleToggle = () => setToggled((prevToggled) => !prevToggled);
    // grid configuration checkbox border
    const [toggled, setToggled] = useState(false);

    const InlineStyles = {
        display: 'grid',
        gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))`,
        gap: `${grid.gap}px`,
        borderWidth: toggled ? `${grid.border}rem` : '0rem',
        padding: `calc(${grid.paddingY}rem * 2) calc(${grid.paddingX}rem * 2)`,
    };

    const GridItemsArray = [...Array(grid.items).keys()];
    return (
        <div className="flex flex-col w-full bg-black" {...testId('tempate-engine-page')}>
            <MainContainer>
                <AsideLeft>
                    <GridConfiguration
                        grid={grid}
                        handleChange={handleChange}
                        toggled={toggled}
                        handleToggle={handleToggle}
                    />
                </AsideLeft>

                <ContentCenter>
                    <DynamicGridLayout style={InlineStyles} arr={GridItemsArray} />
                </ContentCenter>

                <AsideRight>
                    <TeaserPresetsPage />
                    <ExportDynamicCodeTeaser
                        inlineStyles={InlineStyles}
                        gridItemsArray={GridItemsArray}
                    />
                </AsideRight>
            </MainContainer>
        </div>
    );
};

export default ProjectTemplateEnginePage;
