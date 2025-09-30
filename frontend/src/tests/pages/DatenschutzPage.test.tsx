import { mockLogInState } from '@/tests/mocks/redux';
import { navigateTo } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/useScroll', () => ({ default: vi.fn() }));
vi.mock('@/components/RouterLink', () => ({
    default: (props: ComponentProps<'a'>) => <a {...props} />,
}));

describe('DatenschutzPage', () => {
    it('should render the Datenschutz Page', async () => {
        navigateTo({
            route: '/datenschutz',
            preloadedState: mockLogInState,
        });

        const heading = screen.getByRole('heading', { name: /Datenschutzerklärung/i });

        expect(heading).toBeInTheDocument();
        const headlineDatenschutz = screen.getByText(/Verantwortlich für die Datenverarbeitung/i);
        const paragraphDatenschutz = screen.getByText(/Suk-Be Jang - Privatperson/i);
        expect(headlineDatenschutz).toBeInTheDocument();
        expect(paragraphDatenschutz).toBeInTheDocument();
    });
});
