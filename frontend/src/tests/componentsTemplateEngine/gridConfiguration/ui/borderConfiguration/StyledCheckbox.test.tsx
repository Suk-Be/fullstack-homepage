import StyledCheckbox from '@/componentsTemplateEngine/gridConfiguration/ui/borderConfiguration/StyledCheckbox';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('StyledCheckbox', () => {
  it('renders unchecked checkbox by default', () => {
    render(<StyledCheckbox checked={false} onChange={vi.fn()} />);
    const checkbox = screen.getByTestId('styled-checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('role', 'checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('renders checked state correctly', () => {
    render(<StyledCheckbox checked={true} onChange={vi.fn()} />);
    const checkbox = screen.getByTestId('styled-checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange with the toggled value', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<StyledCheckbox checked={false} onChange={mockOnChange} />);

    const checkbox = screen.getByTestId('styled-checkbox');
    await user.click(checkbox);

    // Headless UI ruft onChange mit neuem boolean auf
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when checked is true and user clicks', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<StyledCheckbox checked={true} onChange={mockOnChange} />);

    const checkbox = screen.getByTestId('styled-checkbox');
    await user.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(false);
  });
});
