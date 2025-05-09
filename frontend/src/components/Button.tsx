import Button from '@mui/material/Button';
import { PropsWithChildren } from 'react';

export default function ButtonUsage({ children }: PropsWithChildren) {
    return <Button variant="contained">{children}</Button>;
}
