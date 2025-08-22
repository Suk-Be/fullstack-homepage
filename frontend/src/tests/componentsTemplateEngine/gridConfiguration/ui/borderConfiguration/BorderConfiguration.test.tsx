import BorderConfiguration from '@/componentsTemplateEngine/gridConfiguration/ui/borderConfiguration';
import { MockGrid } from '@/tests/mocks/data';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { vi } from 'vitest';

vi.mock(
    '@/componentsTemplateEngine/gridConfiguration/ui/borderConfiguration/StyledCheckbox',
    () => ({
        __esModule: true,
        default: ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
            <input
                data-testid="styled-checkbox"
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
        ),
    }),
);

vi.mock('@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/RangeSlider', () => ({
    __esModule: true,
    default: ({
        value,
        onChange,
        disabled,
        placeholder,
    }: {
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        disabled?: boolean;
        placeholder: string;
    }) => (
        <div data-testid="range-slider">
            <label htmlFor={placeholder}>Width: </label>
            <span data-testid={`${placeholder}-display-value`}>{value}</span>
            <input
                type="range"
                id={placeholder}
                data-testid={`${placeholder}-value`}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    ),
}));

describe('BorderConfiguration', () => {
    const mockOnChange = vi.fn();
    const mockHandleChange = vi.fn(() => mockOnChange);
    const mockHandleToggle = vi.fn();

    const renderUtils = (initialToggle = false) => {
        const user = userEvent.setup();
        const Wrapper = () => {
            const [toggled, setToggled] = useState(initialToggle);

            return (
                <BorderConfiguration
                    checkBoxBorderToggled={toggled}
                    grid={MockGrid}
                    handleChange={mockHandleChange}
                    handleCheckBoxBorderToggle={() => {
                        mockHandleToggle();
                        setToggled(!toggled);
                    }}
                />
            );
        };

        render(<Wrapper />);

        const borderConfiguration = screen.getByTestId('border-configuration');
        const checkbox = screen.getByTestId('styled-checkbox');

        return { user, borderConfiguration, checkbox };
    };

    it('renders correctly with all elements', () => {
        const toggled = true;
        const { borderConfiguration, checkbox } = renderUtils(toggled);

        expect(borderConfiguration).toBeInTheDocument();

        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toHaveAttribute('type', 'checkbox');
        expect(checkbox).toBeChecked();

        expect(screen.getByTestId('border-display-value')).toHaveTextContent(MockGrid.border);
        expect(screen.getByTestId('border-value')).toHaveValue(MockGrid.border);

        expect(screen.getByText('Unit: rem/3')).toBeInTheDocument();
    });

    it('calls handleToggle when checkbox changes', async () => {
        const toggled = true;
        const { user, checkbox } = renderUtils(toggled);

        await user.click(checkbox);

        expect(mockHandleToggle).toHaveBeenCalled();
    });

    it('enables the range input and calls handleChange when toggled on and input value changes', async () => {
        const toggled = false;
        const { user, checkbox } = renderUtils(toggled);

        const rangeInput = screen.getByTestId('border-value');

        expect(rangeInput).toBeDisabled();

        await user.click(checkbox);
        expect(rangeInput).not.toBeDisabled();

        fireEvent.change(rangeInput, { target: { value: '2' } });
        expect(mockHandleChange).toHaveBeenCalledWith('border');
        expect(mockOnChange).toHaveBeenCalled();
    });
});
