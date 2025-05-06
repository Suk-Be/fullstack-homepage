import { ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import routes from './routes';
import theme from './themes/LinkButtonRouter';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<RouterProvider router={routes} />
		</ThemeProvider>
	</StrictMode>
);
