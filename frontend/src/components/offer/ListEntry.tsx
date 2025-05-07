import { Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

const ListEntry = ({ children }: PropsWithChildren) => {
    return (
        <Typography
            component="p"
            sx={{
                fontFamily: 'Fira Sans',
                fontWeight: 400,
                fontSize: '1rem',
                color: 'rgba(33,29,29, 1)',
                marginLeft: '0.5rem',
                flexGrow: 1,
                lineHeight: '0',
                marginBottom: '0',
                textAlign: 'center',
            }}
        >
            {children}
        </Typography>
    );
};

export default ListEntry;
