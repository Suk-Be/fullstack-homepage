import MarkupGenerator from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup';
import ColspanningGridMarkup from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup/generateMarkup/ColspanningGridMarkup';
import RowspanningGridMarkup from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup/generateMarkup/RowspanningGridMarkup';
import RowspanningGrid from '@/componentsTemplateEngine/presetRenderExamples/grids/RowspanningGrid';
import { testId } from '@/utils/testId';
import ColspanningGrid from './grids/ColspanningGrid';
import Headline from './Headline';

type LayoutColSpanConfigValue = 'col-span-2';

type SpanningGridPresetProps = {
    heading: string;
    layoutColSpanConfig?: LayoutColSpanConfigValue;
    testID: string;
};

const ColSpanGrid = ({
    layoutColSpanConfig,
}: {
    layoutColSpanConfig: LayoutColSpanConfigValue;
}) => (
    <div className="flex flex-col">
        <div className="w-full h-full">
            <div className="w-full h-full">
                <ColspanningGrid layoutConfig={layoutColSpanConfig} />
            </div>
        </div>

        <MarkupGenerator component={<ColspanningGridMarkup layoutConfig={layoutColSpanConfig} />} />
    </div>
);

const RowspanGrid = () => (
    <div className="flex flex-col">
        <div className="w-full h-f  ull">
            <div className="w-full h-full">
                <RowspanningGrid />
            </div>
        </div>

        <MarkupGenerator component={<RowspanningGridMarkup />} />
    </div>
);

const SpanningGridPreset = ({ heading, layoutColSpanConfig, testID }: SpanningGridPresetProps) => {
    return (
        <section className="w-full mx-auto" {...testId(testID)}>
            <Headline>{heading}</Headline>

            {layoutColSpanConfig ? (
                <ColSpanGrid layoutColSpanConfig={layoutColSpanConfig} />
            ) : (
                <RowspanGrid />
            )}
        </section>
    );
};

export default SpanningGridPreset;
