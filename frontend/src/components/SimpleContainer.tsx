import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import { PropsWithChildren } from 'react';

export default function SimpleContainer({ children }: PropsWithChildren) {
	return (
		<Container maxWidth="sm">
			<Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>{children}</Box>
		</Container>
	);
}
