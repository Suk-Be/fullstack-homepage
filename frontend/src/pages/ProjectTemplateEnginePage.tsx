import CreateGridLayout from '@/componentsTemplateEngine/gridConfiguration/CreateGridLayout';
import LayoutConfiguration from '@/componentsTemplateEngine/gridConfiguration/ui';
import GridSaver from '@/componentsTemplateEngine/gridSaver';
import AsideLeft from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/AsideLeft';
import AsideRight from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/AsideRight';
import ContentCenter from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/ContentCenter';
import MainContainer from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/MainContainer';
import TeaserGenerateMarkup from '@/componentsTemplateEngine/teaser/GenerateMarkupTeaser';
import ExampleTeaser from '@/componentsTemplateEngine/teaser/LayoutExampleTeaser';
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
        borderWidth: toggled ? `calc(${grid.border}rem/3)` : '0rem',
        padding: `calc(${grid.paddingY}rem/2) calc(${grid.paddingX}rem/2)`,
    };

    // console.log('grid: ', grid);

    // console.log('InlineStyles: ', InlineStyles);

    const GridItemsArray = [...Array(grid.items).keys()];

    return (
        <div className="flex flex-col w-full bg-black mb-[5rem]" {...testId('tempate-engine-page')}>
            <MainContainer>
                <AsideLeft>
                    <LayoutConfiguration
                        grid={grid}
                        handleChange={handleChange}
                        toggled={toggled}
                        handleToggle={handleToggle}
                    />
                </AsideLeft>

                <ContentCenter>
                    <CreateGridLayout style={InlineStyles} arr={GridItemsArray} />
                    <GridSaver grid={grid} />
                </ContentCenter>

                <AsideRight>
                    <ExampleTeaser />
                    <TeaserGenerateMarkup
                        inlineStyles={InlineStyles}
                        gridItemsArray={GridItemsArray}
                    />
                </AsideRight>
            </MainContainer>
        </div>
    );
};

export default ProjectTemplateEnginePage;
