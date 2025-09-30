import App from '@/App';
import { renderWithProviders } from '@/tests/utils/testRenderUtils'; // Adjust path to your test utility
import { screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/useScroll', () => ({ default: vi.fn() }));
vi.mock('@/components/RouterLink', () => ({
    default: (props: ComponentProps<'a'>) => <a {...props} />,
}));

describe('App', () => {
    it('should render the Layout component', () => {
        renderWithProviders(<App />);

        expect(screen.getByTestId('main')).toBeInTheDocument();
    });
});
