import RowspanningGridMarkup from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/RowspanningGridMarkup';
import MarkupGenerator from '@/componentsTemplateEngine/gridConfiguration/markUp/staticMarkupGenerator';
import ColspanningGridMarkup from '@/componentsTemplateEngine/gridConfiguration/markUp/staticMarkupGenerator/ColspanningGridMarkup';
import ColspanningGrid from './ColspanningGrid';
import Headline from './Headline';
import RowspanningGrid from './RowspanningGrid';

type SpanningGridPresetProps = {
    heading: string;
    colSpan?: 'col-span-2';
};

const SpanningGridPreset = ({ heading, colSpan }: SpanningGridPresetProps) => {
    return (
        <section className="w-full mx-auto">
            <Headline>{heading}</Headline>
            <div className="flex flex-col">
                <div className="w-full h-full">
                    <div className="w-full h-full">
                        {colSpan ? <ColspanningGrid className={colSpan} /> : <RowspanningGrid />}
                    </div>
                </div>
                {colSpan ? (
                    <MarkupGenerator
                        gridMarkupComponent={<ColspanningGridMarkup hasCol={colSpan} />}
                    />
                ) : (
                    <MarkupGenerator gridMarkupComponent={<RowspanningGridMarkup />} />
                )}
            </div>
        </section>
    );
};

export default SpanningGridPreset;
