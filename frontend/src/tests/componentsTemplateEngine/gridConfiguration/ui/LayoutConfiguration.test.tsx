import LayoutConfiguration from '@/componentsTemplateEngine/gridConfiguration/ui/';
import { GridProps, HandleChange } from '@/types/templateEngine';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

type Props = {
    handleChange: HandleChange;
    grid: GridProps;
};

vi.mock('@/componentsTemplateEngine/gridConfiguration/ui/GridConfiguration', () => ({
    __esModule: true,
    default: ({ handleChange, grid }: Props) => (
        <div data-testid="grid-configuration">
            <input onChange={handleChange('items')} />
            {JSON.stringify(grid.items)}
        </div>
    ),
}));

vi.mock('@/componentsTemplateEngine/gridConfiguration/ui/GapConfiguration', () => ({
    __esModule: true,
    default: ({ handleChange, grid }: any) => (
        <div data-testid="gap-configuration">
            <input onChange={handleChange('items')} />
            {JSON.stringify(grid.gap)}
        </div>
    ),
}));

vi.mock('@/componentsTemplateEngine/gridConfiguration/ui/borderConfiguration', () => ({
    __esModule: true,
    default: ({ handleChange, grid, toggled, handleToggle }: any) => (
        <div data-testid="border-configuration">
            <input type="checkbox" checked={toggled} onChange={handleToggle} />
            <input onChange={handleChange('border')} />
            {JSON.stringify(grid.border)}
        </div>
    ),
}));

vi.mock('@/componentsTemplateEngine/gridConfiguration/ui/PaddingConfiguration', () => ({
    __esModule: true,
    default: ({ handleChange, grid }: any) => (
        <div data-testid="padding-configuration">
            <input onChange={handleChange('border')} />
            {JSON.stringify(grid.paddingX)}
            {JSON.stringify(grid.paddingY)}
        </div>
    ),
}));

vi.mock('@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/Divider', () => ({
    __esModule: true,
    default: () => <hr data-testid="hr" />,
}));

describe('LayoutConfiguration', () => {
    const mockGrid: GridProps = {
        items: '1',
        columns: '1',
        gap: '0',
        border: '0',
        paddingX: '0',
        paddingY: '0',
    };

    const mockHandleChange = vi.fn();
    const mockHandleToggle = vi.fn();

    it('renders all layout configuration sections with correct props', () => {
        render(
            <LayoutConfiguration
                grid={mockGrid}
                handleChange={mockHandleChange}
                toggled={true}
                handleToggle={mockHandleToggle}
            />,
        );

        expect(screen.getByTestId('grid-configuration')).toBeInTheDocument();
        expect(screen.getByTestId('gap-configuration')).toBeInTheDocument();
        expect(screen.getByTestId('border-configuration')).toBeInTheDocument();
        expect(screen.getByTestId('padding-configuration')).toBeInTheDocument();
        expect(screen.getByTestId('hr')).toBeInTheDocument();
    });
});
