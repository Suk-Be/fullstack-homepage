import { useCallback, useState } from 'react';

const useModalToggle = () => {
    const [open, setOpen] = useState(false);
    
    const handleClickOpen = useCallback(() => {
        setOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    return { open, handleClose, handleClickOpen };
};

export default useModalToggle