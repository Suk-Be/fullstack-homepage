import PaddingConfiguration from '@/componentsTemplateEngine/gridConfiguration/ui/PaddingConfiguration';
import { MockGrid } from '@/tests/mocks/data';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

describe('PaddingConfiguration', () => {
    const mockOnChange = vi.fn();
    const mockHandleChange = vi.fn(() => mockOnChange);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderPaddingConfig = (grid = MockGrid) => {
        render(<PaddingConfiguration handleChange={mockHandleChange} grid={grid} />);
        return {
            horizontalInput: screen.getByLabelText('Horizontal:'),
            verticalInput: screen.getByLabelText('Vertical:'),
        };
    };

    it('renders all elements correctly with initial values', () => {
        const { horizontalInput, verticalInput } = renderPaddingConfig();

        expect(screen.getByTestId('padding-configuration')).toBeInTheDocument();
        expect(horizontalInput).toBeInTheDocument();
        expect(verticalInput).toBeInTheDocument();

        expect(horizontalInput).toHaveValue(0);
        expect(verticalInput).toHaveValue(0);

        expect(screen.getByText('Unit: rem/2')).toBeInTheDocument();
    });

    it('calls handleChange and onChange when horizontal input changes', () => {
        const { horizontalInput } = renderPaddingConfig();

        fireEvent.change(horizontalInput, { target: { value: '3' } });

        expect(mockHandleChange).toHaveBeenCalledWith('paddingX');
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('calls handleChange and onChange when vertical input changes', () => {
        const { verticalInput } = renderPaddingConfig();

        fireEvent.change(verticalInput, { target: { value: '2' } });

        expect(mockHandleChange).toHaveBeenCalledWith('paddingY');
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
});
