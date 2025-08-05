import ExampleTeaser from '@/componentsTemplateEngine/teaser';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mocks
vi.mock('./LayoutExampleTeaser', () => ({
    __esModule: true,
    default: () => <div data-testid="grid-eample-teaser" />,
}));

vi.mock('@/componentsTemplateEngine/buttons/Button', () => ({
    __esModule: true,
    default: ({ children, className }: any) => (
        <button data-testid="button-example-teaser" className={className}>
            {children}
        </button>
    ),
}));

describe('ExampleTeaser', () => {
    it('renders layout example teaser correctly', () => {
        render(
            <MemoryRouter>
                <ExampleTeaser />
            </MemoryRouter>,
        );

        const container = screen.getByTestId('layout-example-teaser');
        expect(container).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: /layout example grids/i })).toBeInTheDocument();

        expect(screen.getByTestId('grid-eample-teaser')).toBeInTheDocument();

        // Button vorhanden
        const button = screen.getByTestId('button-example-teaser');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Browse Examples');
        const style =
            'mb-4 text-center bg-gray-light text-white shadow-inner shadow-white/50 group-focus:outline-none group-hover:bg-gray-dark  group-hover:text-green group-open:bg-gray-dark/700 group-focus:outline-1 group-focus:outline-white';
        expect(button.className).toContain(style);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/template-engine/presets');
    });
});
