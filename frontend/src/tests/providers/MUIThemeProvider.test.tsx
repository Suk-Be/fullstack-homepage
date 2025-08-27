import MUIThemeProvider from '@/themes/AppTheme';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('MUIThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <MUIThemeProvider>
        <div data-testid="child">Hello Theme</div>
      </MUIThemeProvider>
    );

    const child = screen.getByTestId('child');
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Hello Theme');
  });
});
