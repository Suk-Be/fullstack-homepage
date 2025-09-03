import HeadlineAside from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/HeadlineAside';
import SaveGridsModal from '@/componentsTemplateEngine/modals/SaveGridsModal';
import { testId } from '@/utils/testId';

const SaveGridsTeaser = () => {
    return (
        <div {...testId('teaser-save-this-grid')}>
            <HeadlineAside children="Save this Grid" />
            <SaveGridsModal />
        </div>
    );
};

export default SaveGridsTeaser;
