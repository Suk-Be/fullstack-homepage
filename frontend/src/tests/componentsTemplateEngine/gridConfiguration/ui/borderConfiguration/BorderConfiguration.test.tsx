import BorderConfiguration from '@/componentsTemplateEngine/gridConfiguration/ui/borderConfiguration';
import { MockGrid } from '@/tests/mocks/data';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';



vi.mock('@/componentsTemplateEngine/gridConfiguration/ui/borderConfiguration/StytledCheckbox', () => ({
  __esModule: true,
  default: ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <input
      data-testid="styled-checkbox"
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  ),
}));

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
    children: React.ReactNode;
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
  const mockHandleChange = vi.fn().mockImplementation(() => vi.fn());
  const mockHandleToggle = vi.fn();

  it('renders correctly with all elements', () => {
    render(
      <BorderConfiguration
        toggled={true}
        grid={MockGrid}
        handleChange={mockHandleChange}
        handleToggle={mockHandleToggle}
      />,
    );

    expect(screen.getByTestId('border-configuration')).toBeInTheDocument();

    const checkbox = screen.getByTestId('styled-checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox).toBeChecked();

    expect(screen.getByTestId('border-display-value')).toHaveTextContent(MockGrid.border);
    expect(screen.getByTestId('border-value')).toHaveValue(MockGrid.border);

    expect(screen.getByText('Unit: rem/3')).toBeInTheDocument();
  });

  it('calls handleToggle when checkbox changes', async () => {
    render(
      <BorderConfiguration
        toggled={false}
        grid={MockGrid}
        handleChange={mockHandleChange}
        handleToggle={mockHandleToggle}
      />,
    );
    const user = userEvent.setup();

    const checkbox = screen.getByTestId('styled-checkbox');
    await user.click(checkbox);

    expect(mockHandleToggle).toHaveBeenCalled();
  });
});
