import GapConfiguration from '@/componentsTemplateEngine/gridConfiguration/ui/GapConfiguration';
import { MockGrid } from '@/tests/mocks/data';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

const mockHandleChange = vi.fn().mockImplementation(() => vi.fn());

vi.mock('@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/RangeSlider', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="range-slider">
      <label htmlFor={placeholder}>Gap: </label>
      <span data-testid={`${placeholder}-display-value`}>{value}</span>
      <input
        type="range"
        id={placeholder}
        data-testid={`${placeholder}-value`}
        value={value}
        onChange={onChange}
      />
    </div>
  ),
}));

vi.mock('@/componentsTemplateEngine/gridConfiguration/ui/shared-comnponents/InputLabel', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe('GapConfiguration', () => {
  const renderUtils = () => {
    const user = userEvent.setup();
    
    render(<GapConfiguration handleChange={mockHandleChange} grid={MockGrid} />);

    const range = screen.getByTestId('gap-value');
    const display = screen.getByTestId('gap-display-value');
    const input = screen.getByTestId('gap-value');

    return {
      user,
      range,
      display,
      input
    }
  }

  it('renders correctly with all elements', () => {
    const {range, display} = renderUtils()

    expect(screen.getByTestId('gap-configuration')).toBeInTheDocument();

    expect(range).toHaveAttribute('type', 'range');
    expect(range).toHaveValue(MockGrid.gap);

    expect(display).toHaveTextContent(MockGrid.gap);

    expect(screen.getByText('Unit: px')).toBeInTheDocument();
    expect(screen.getByLabelText('Gap:')).toBeInTheDocument();
  });

  it('calls handleChange when the range input changes', async () => {
    const {user, input} = renderUtils()

    await user.type(input, '{arrowup}');
    expect(mockHandleChange).toHaveBeenCalledWith('gap');

    fireEvent.change(input, { target: { value: '2' } });
    expect(mockHandleChange).toHaveBeenCalledWith('gap');
  });
});
