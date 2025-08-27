import RangeSlider from '@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/RangeSlider';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { vi } from 'vitest';

describe('RangeSlider', () => {
    const mockOnChange = vi.fn();

    const labelText = 'Test Label';
    const placeholder = 'test-placeholder';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const ControlledRangeSlider = (
        props: Partial<React.ComponentProps<typeof RangeSlider>> = {},
    ) => {
        const [value, setValue] = useState(props.value ?? '5');

        // onChange ruft mockOnChange UND setValue auf
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            mockOnChange(e);
            setValue(e.target.value);
            if (props.onChange) props.onChange(e);
        };

        return (
            <RangeSlider value={value} onChange={onChange} placeholder={placeholder} {...props}>
                {labelText}
            </RangeSlider>
        );
    };

    const renderUtils = (props = {}) => {
        render(<ControlledRangeSlider {...props} />);

        return {
            rangeInput: screen.getByTestId(`${placeholder}-value`),
            label: screen.getByText(labelText),
            displayValue: screen.getByTestId(`${placeholder}-display-value`),
        };
    };

    it('renders label, value display and range input correctly (default values)', () => {
        const { label, rangeInput, displayValue } = renderUtils();

        expect(label).toBeInTheDocument();
        expect(displayValue).toHaveTextContent('5');

        expect(rangeInput).toBeInTheDocument();
        expect(rangeInput).toHaveAttribute('type', 'range');
        expect(rangeInput).toHaveAttribute('min', '0');
        expect(rangeInput).toHaveAttribute('max', '11');
        expect(rangeInput).toHaveValue('5');
        expect(rangeInput).not.toBeDisabled();
    });

    it('accepts custom min, max, step and disabled props', () => {
        const { rangeInput, displayValue } = renderUtils({
            min: '2',
            max: '10',
            step: '2',
            disabled: true,
            value: '4',
        });

        expect(rangeInput).toHaveAttribute('min', '2');
        expect(rangeInput).toHaveAttribute('max', '10');
        expect(rangeInput).toHaveAttribute('step', '2');
        expect(rangeInput).toHaveValue('4');
        expect(rangeInput).toBeDisabled();
        expect(displayValue).toHaveTextContent('4');
    });

    it('calls onChange handler when value changes', () => {
        const { rangeInput, displayValue } = renderUtils();

        expect(displayValue).toHaveTextContent('5');
        fireEvent.change(rangeInput, { target: { value: '7' } });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange.mock.calls[0][0].target.value).toBe('7');

        // Wert wurde im State geändert => UI aktualisiert
        expect(rangeInput).toHaveValue('7');
        expect(displayValue).toHaveTextContent('7');
    });
});
