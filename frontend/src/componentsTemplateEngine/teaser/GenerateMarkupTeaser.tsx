import HeadlineAside from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/HeadlineAside';
import CreateMarkupModal from '@/componentsTemplateEngine/modals/CreateMarkupModal';
import { DynamicGridProps } from '@/types/templateEngine';
import { testId } from '@/utils/testId';

const GenerateMarkupTeaser = ({ inlineStyles, gridItemsArray }: DynamicGridProps) => {
    return (
        <div {...testId('teaser-generate-markup')}>
            <HeadlineAside>Generate HTML</HeadlineAside>
            <CreateMarkupModal inlineStyles={inlineStyles} gridItemsArray={gridItemsArray} />
        </div>
    );
};

export default GenerateMarkupTeaser;
