import { useState } from 'react';
import DialogModal from '../../../componentsTemplateEngine/DialogModal';
import { DynamicGridProps } from '../../../types/templateEngine';
import { buttonText } from '../../../utils/templateEngine/buttonText';

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
            <h2 className="text-lg font-bold pb-4">Export Code</h2>
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
