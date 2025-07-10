import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../App';
import * as AuthHook from '../hooks/auth/useAuthInit'; // Import the module containing useAuthInit
import { renderWithProviders } from './utils/testRenderUtils'; // Adjust path to your test utility

vi.spyOn(AuthHook, 'useAuthInit').mockImplementation(() => {});

vi.mock('../pages/Layout', () => ({
    default: () => <div data-testid="layout-component">Mocked Layout</div>,
}));

describe('App', () => {
    it('should call useAuthInit and render the Layout component', () => {
        renderWithProviders(<App />);

        expect(AuthHook.useAuthInit).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('layout-component')).toBeInTheDocument();
    });
});
