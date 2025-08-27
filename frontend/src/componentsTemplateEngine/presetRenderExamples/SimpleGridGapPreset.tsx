import GenerateMarkupContainer from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup';
import SimpleGridMarkup from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup/generateMarkup/SimpleGridMarkup';
import { testId } from '@/utils/testId';
import Headline from './Headline';
import SimpleGrid from './grids/SimpleGrid';

type SimpleGridPresetProps = {
    heading: string;
    layoutGapConfig: 'gap-4' | 'gap-2';
    testID: string;
};

const SimpleGridGapPreset = ({ heading, layoutGapConfig, testID }: SimpleGridPresetProps) => {
    const RenderGrid = () => {
        return (
            <div className="w-full h-full">
                <SimpleGrid layoutGapConfig={layoutGapConfig} />
            </div>
        );
    };

    const MarkupGrid = () => (
        <GenerateMarkupContainer
            component={<SimpleGridMarkup layoutGapConfig={layoutGapConfig} />}
        />
    );

    return (
        <section className="w-full mx-auto" {...testId(testID)}>
            <Headline>{heading}</Headline>
            <div className="flex flex-col">
                <RenderGrid />
                <MarkupGrid />
            </div>
        </section>
    );
};

export default SimpleGridGapPreset;
