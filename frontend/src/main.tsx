import CssBaseline from '@mui/material/CssBaseline';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router';
import routes from './routes';
import { default as ThemeProvider } from './themes/AppTheme';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
        </ThemeProvider>
    </StrictMode>,
);
