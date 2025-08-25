import HeadlineAside from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/HeadlineAside';
import SaveGridsModal from '@/componentsTemplateEngine/modals/SaveGridsModal';
import { testId } from '@/utils/testId';

const SaveGridsTeaser = () => {
    return (
        <div {...testId('teaser-generate-markup')}>
            <HeadlineAside children="Speicher Grid" />
            <SaveGridsModal />
        </div>
    );
};

export default SaveGridsTeaser;
