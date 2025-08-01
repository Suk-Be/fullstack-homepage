import DialogModal from '@/componentsTemplateEngine/createGridMarkupWithModal/DialogModal';
import HeadlineAside from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/HeadlineAside';
import { DynamicGridProps } from '@/types/templateEngine';
import { copyButtonText } from '@/utils/templateEngine/buttonText';
import { testId } from '@/utils/testId';
import { useState } from 'react';

const ExportDynamicCodeTeaser = ({ inlineStyles, gridItemsArray }: DynamicGridProps) => {
    let [isOpen, setIsOpen] = useState({
        open: false,
        text: copyButtonText.copyToClipboard,
        isCopied: false,
    });

    function handleOpen() {
        setIsOpen({
            ...isOpen,
            open: true,
        });
    }

    function handleClose() {
        setIsOpen({
            ...isOpen,
            open: false,
        });
    }
    return (
        <div {...testId('create-markup-teaser')}>
            <HeadlineAside children="Erstelle HTML" />
            <DialogModal
                inlineStyles={inlineStyles}
                gridItemsArray={gridItemsArray}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                handleOpen={handleOpen}
                handleClose={handleClose}
            />
        </div>
    );
};

export default ExportDynamicCodeTeaser;
