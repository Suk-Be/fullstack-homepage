import MainContainerPresets from '@/componentsTemplateEngine/pageContainers/layoutPresets/MainContainerPresetsPage';
import SimpleGridGapPreset from '@/componentsTemplateEngine/presetRenderExamples/SimpleGridGapPreset';
import SpanningGridPreset from '@/componentsTemplateEngine/presetRenderExamples/SpanningGridPreset';

export default function ProjectTemplateEnginePresetsPage() {
    return (
        <div className="flex-1 flex bg-white ">
            <MainContainerPresets>
                <h1 className="text-5xl font-bold text-green-dark text-center text-gray-700 pb-2 sans">
                    Simple Example Grids
                </h1>
                <div className="w-full bg-white h-full">
                    <div className="grid grid-cols-1 xl:grid-cols-1 gap-9 px-4 py-4 w-full xl:w-1/2 mx-auto">
                        <SimpleGridGapPreset
                            heading="Grid"
                            layoutGapConfig="gap-4"
                            testID="example-simple-grid-gap-4"
                        />
                        <SimpleGridGapPreset
                            heading="with smaller gaps"
                            layoutGapConfig="gap-2"
                            testID="example-simple-grid-gap-2"
                        />
                        <SpanningGridPreset
                            heading="with spanning columns"
                            layoutColSpanConfig="col-span-2"
                            testID="example-spanning-grid-col-span-2"
                        />
                        <SpanningGridPreset
                            heading="with spanning rows"
                            testID="example-spanning-grid-col-row-span"
                        />
                    </div>
                </div>
            </MainContainerPresets>
        </div>
    );
}
