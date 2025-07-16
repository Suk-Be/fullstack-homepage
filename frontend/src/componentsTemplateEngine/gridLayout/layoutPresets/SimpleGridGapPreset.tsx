import MarkupGenerator from '../markUpGeneratorStatic';
import SimpleGridMarkup from '../markUpGeneratorStatic/SimpleGridMarkup';
import Headline from './Headline';
import SimpleGrid from './SimpleGrid';

type SimpleGridPresetProps = {
    heading: string;
    className: 'gap-4' | 'gap-2';
};

const SimpleGridGapPreset = ({ heading, className }: SimpleGridPresetProps) => {
    return (
        <section className="w-full mx-auto">
            <Headline>{heading}</Headline>
            <div className="flex flex-col">
                <div className="w-full h-full">
                    <SimpleGrid className={className} />
                </div>
                <MarkupGenerator gridMarkupComponent={<SimpleGridMarkup hasGap={className} />} />
            </div>
        </section>
    );
};

export default SimpleGridGapPreset;
