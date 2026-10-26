import HeadlineAside from '@/componentsTemplateEngine/gridConfigurations/ui/ui-shared-comnponents/HeadlineAside';
import SaveGridsModal from '@/componentsTemplateEngine/modals/SaveGridsModal';
import { testId } from '@/utils/testId';

const SaveGridsTeaser = () => {
    return (
        <div {...testId('teaser-save-this-grid')}>
            <HeadlineAside>Save this Grid</HeadlineAside>
            <SaveGridsModal />
        </div>
    );
};

export default SaveGridsTeaser;
