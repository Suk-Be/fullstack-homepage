import MarkupGenerator from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup';
import ColspanningGridMarkup from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup/generateMarkup/ColspanningGridMarkup';
import RowspanningGridMarkup from '@/componentsTemplateEngine/presetRenderExamples/ctaGenerateMarkup/generateMarkup/RowspanningGridMarkup';
import { testId } from '@/utils/testId';
import ColspanningGrid from './ColspanningGrid';
import Headline from './Headline';
import RowspanningGrid from './RowspanningGrid';

type SpanningGridPresetProps = {
    heading: string;
    colSpan?: 'col-span-2';
    testID: string;
};

const SpanningGridPreset = ({ heading, colSpan, testID }: SpanningGridPresetProps) => {
    return (
        <section className="w-full mx-auto" {...testId(testID)}>
            <Headline>{heading}</Headline>
            <div className="flex flex-col">
                <div className="w-full h-full">
                    <div className="w-full h-full">
                        {colSpan ? <ColspanningGrid className={colSpan} /> : <RowspanningGrid />}
                    </div>
                </div>
                {colSpan ? (
                    <MarkupGenerator component={<ColspanningGridMarkup hasCol={colSpan} />} />
                ) : (
                    <MarkupGenerator component={<RowspanningGridMarkup />} />
                )}
            </div>
        </section>
    );
};

export default SpanningGridPreset;
