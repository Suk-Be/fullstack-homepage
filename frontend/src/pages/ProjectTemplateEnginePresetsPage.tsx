import MainContainerPresets from '@/componentsTemplateEngine/pageContainers/layoutPresets/MainContainerPresetsPage';
import SimpleGridGapPreset from '@/componentsTemplateEngine/presetRenderings/SimpleGridGapPreset';
import SpanningGridPreset from '@/componentsTemplateEngine/presetRenderings/SpanningGridPreset';

export default function Presets() {
    return (
        <div className="flex-1 flex bg-white ">
            <MainContainerPresets>
                <h1 className="text-5xl font-bold text-green-dark text-center text-gray-700 pb-2 sans">
                    Grid Layout Presets
                </h1>
                <div className="w-full bg-white h-full">
                    <div className="grid grid-cols-1 xl:grid-cols-1 gap-9 px-4 py-4 w-full xl:w-1/2 mx-auto">
                        <SimpleGridGapPreset heading="Simple Grid" className="gap-4" />
                        <SimpleGridGapPreset heading="Simple Grid, Small Gaps" className="gap-2" />
                        <SpanningGridPreset heading="Spanning Columns" colSpan="col-span-2" />
                        <SpanningGridPreset heading="Spanning Rows" />
                    </div>
                </div>
            </MainContainerPresets>
        </div>
    );
}
