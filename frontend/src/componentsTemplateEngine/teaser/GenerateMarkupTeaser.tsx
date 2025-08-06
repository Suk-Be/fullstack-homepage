import DialogModal from '@/componentsTemplateEngine/createGridMarkupWithModal/DialogModal';
import HeadlineAside from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/HeadlineAside';
import { DynamicGridProps } from '@/types/templateEngine';
import { testId } from '@/utils/testId';

const TeaserGenerateMarkup = ({ inlineStyles, gridItemsArray }: DynamicGridProps) => {
    return (
        <div {...testId('teaser-generate-markup')}>
            <HeadlineAside children="Erstelle HTML" />
            <DialogModal inlineStyles={inlineStyles} gridItemsArray={gridItemsArray} />
        </div>
    );
};

export default TeaserGenerateMarkup;
