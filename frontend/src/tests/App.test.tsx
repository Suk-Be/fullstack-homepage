import App from '@/App';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './utils/testRenderUtils'; // Adjust path to your test utility

describe('App', () => {
    it('should render the Layout component', () => {
        renderWithProviders(<App />);

        expect(screen.getByTestId('main')).toBeInTheDocument();
    });
});
