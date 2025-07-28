import DialogModal from '@/componentsTemplateEngine/createGridMarkupWithModal/DialogModal';
import HeadlineAside from '@/componentsTemplateEngine/gridConfiguration/ui/HeadlineAside';
import { DynamicGridProps } from '@/types/templateEngine';
import { buttonText } from '@/utils/templateEngine/buttonText';
import { useState } from 'react';

const ExportDynamicCodeTeaser = ({ inlineStyles, gridItemsArray }: DynamicGridProps) => {
    let [isOpen, setIsOpen] = useState({
        open: false,
        text: buttonText.copyToClipboard[0],
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
        <aside data-testid="create-markup-teaser">
            <HeadlineAside children="Export Code" />
            <DialogModal
                inlineStyles={inlineStyles}
                gridItemsArray={gridItemsArray}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                handleOpen={handleOpen}
                handleClose={handleClose}
            />
        </aside>
    );
};

export default ExportDynamicCodeTeaser;
