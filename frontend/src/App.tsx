import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

function App() {
	return (
		<Box
			sx={{
				width: '100vw',
				display: 'flex',
				justifyContent: 'center',
			}}>
			<Box
				sx={{
					width: '500px',
					display: 'flex',
					flexDirection: 'column',
				}}>
				<Typography variant="h1">How would you rate this experience?</Typography>
				<Button variant="contained">Hello World</Button>
				<Rating value={1.5} />
			</Box>
		</Box>
	);
}

export default App;
