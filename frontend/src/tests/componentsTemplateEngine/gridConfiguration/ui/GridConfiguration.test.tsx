import GridConfiguration from '@/componentsTemplateEngine/gridConfiguration/ui/GridConfiguration';
import { MockGrid } from '@/tests/mocks/data';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

describe('GridConfiguration', () => {
    const mockOnChange = vi.fn();
    const mockHandleChange = vi.fn(() => mockOnChange);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderUtils = () => {
        render(<GridConfiguration handleChange={mockHandleChange} grid={MockGrid} />);

        return {
            items: screen.getByLabelText('Items:'),
            columns: screen.getByLabelText('Columns:'),
        };
    };

    it('renders all elements correctly', () => {
        const { items, columns } = renderUtils();

        expect(screen.getByTestId('grid-configuration')).toBeInTheDocument();

        expect(items).toBeInTheDocument();
        expect(columns).toBeInTheDocument();

        const elements = screen.getAllByDisplayValue('1');
        expect(elements.length).toBe(2);
    });

    it('calls handleChange when items input changes', () => {
        const { items } = renderUtils();

        fireEvent.change(items, { target: { value: '10' } });

        expect(mockHandleChange).toHaveBeenCalledWith('items');
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('calls handleChange when columns input changes', () => {
        const { columns } = renderUtils();

        fireEvent.change(columns, { target: { value: '6' } });

        expect(mockHandleChange).toHaveBeenCalledWith('columns');
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
});
