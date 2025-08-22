import CreateGridLayout from '@/componentsTemplateEngine/gridConfiguration/CreateGridLayout';
import LayoutConfiguration from '@/componentsTemplateEngine/gridConfiguration/ui';
import GridSaver from '@/componentsTemplateEngine/gridSaver';
import AsideLeft from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/AsideLeft';
import AsideRight from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/AsideRight';
import ContentCenter from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/ContentCenter';
import MainContainer from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/MainContainer';
import TeaserGenerateMarkup from '@/componentsTemplateEngine/teaser/GenerateMarkupTeaser';
import ExampleTeaser from '@/componentsTemplateEngine/teaser/LayoutExampleTeaser';
import { useAppSelector } from '@/store/hooks';
import { selectInitialGrid } from '@/store/selectors/userGridSelectors';
import { updateGrid } from '@/store/userSaveGridsSlice';
import { GridConfigKey } from '@/types/Redux';
import { testId } from '@/utils/testId';
import { ChangeEvent, FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import '../ProjectTemplateEnginePage.css';

const ProjectTemplateEnginePage: FC = () => {
    const dispatch = useDispatch();
    const grid = useAppSelector(selectInitialGrid);

    const handleChange = (key: GridConfigKey) => (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateGrid({ layoutId: 'initial', key, value: e.target.value }));
    };

    // grid configuration checkbox border
    const [checkBoxBorderToggled, setCheckBoxBorderToggled] = useState(false);
    const handleCheckBoxBorderToggle = () => setCheckBoxBorderToggled((prevToggled) => !prevToggled);

    const InlineStyles = {
        display: 'grid',
        gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))`,
        gap: `${grid.gap}px`,
        borderWidth: checkBoxBorderToggled ? `calc(${grid.border}rem/3)` : 'calc(0rem/3)',
        padding: `calc(${grid.paddingY}rem/2) calc(${grid.paddingX}rem/2)`,
    };

    const gridItems = parseInt(grid.items, 10);
    const GridItemsArray = Array.from({ length: gridItems }, (_, index) => index + 1);

    return (
        <div className="flex flex-col w-full bg-black mb-[5rem]" {...testId('tempate-engine-page')}>
            <MainContainer>
                <AsideLeft>
                    <LayoutConfiguration
                        grid={grid}
                        handleChange={handleChange}
                        checkBoxBorderToggled={checkBoxBorderToggled}
                        handleCheckBoxBorderToggle={handleCheckBoxBorderToggle}
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
