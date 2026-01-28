import CreateGridLayout from '@/componentsTemplateEngine/gridConfigurations/CreateGridLayout';
import LayoutConfiguration from '@/componentsTemplateEngine/gridConfigurations/ui';
import AsideLeft from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/AsideLeft';
import AsideRight from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/AsideRight';
import ContentCenter from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/ContentCenter';
import MainContainer from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/MainContainer';
import GenerateMarkupTeaser from '@/componentsTemplateEngine/teasers/GenerateMarkupTeaser';
import ExampleTeaser from '@/componentsTemplateEngine/teasers/layoutExampleTeasers/LayoutExampleTeaser';
import SaveGridsTeaser from '@/componentsTemplateEngine/teasers/SaveGridsTeaser';
import { useAppSelector } from '@/store/hooks';
import { selectInitialGrid } from '@/store/selectors/userGridSelectors';
import { initialLayoutId, updateGridConfig } from '@/store/userSaveGridsSlice';
import { GridConfigKey } from '@/types/Redux';
import { buildGridRenderPropsFromConfig } from '@/utils/templateEngine/gridStyle';
import { testId } from '@/utils/testId';
import { ChangeEvent, FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import '../ProjectTemplateEnginePage.css';

const ProjectTemplateEnginePage: FC = () => {
    const dispatch = useDispatch();
    const grid = useAppSelector(selectInitialGrid);

    const handleChange = (key: GridConfigKey) => (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateGridConfig({ layoutId: initialLayoutId, key, value: e.target.value }));
    };

    // grid configuration checkbox border
    const [checkBoxBorderToggled, setCheckBoxBorderToggled] = useState(false);
    const handleCheckBoxBorderToggle = () =>
        setCheckBoxBorderToggled((prevToggled) => !prevToggled);

    const { inlineStyles, gridItemsArray } = buildGridRenderPropsFromConfig(grid);

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
                    <CreateGridLayout style={inlineStyles} arr={gridItemsArray} />
                </ContentCenter>

                <AsideRight>
                    <ExampleTeaser />
                    <SaveGridsTeaser />
                    <GenerateMarkupTeaser
                        inlineStyles={inlineStyles}
                        gridItemsArray={gridItemsArray}
                    />
                </AsideRight>
            </MainContainer>
        </div>
    );
};

export default ProjectTemplateEnginePage;
