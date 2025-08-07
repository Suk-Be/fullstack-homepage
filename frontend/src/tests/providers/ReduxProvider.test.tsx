import ReduxProvider from '@/providers/ReduxProvider';
import type { RootState } from '@/store';
import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { describe, expect, it } from 'vitest';

const TestComponent = () => {
  const isLoggedIn = useSelector((state: RootState) => state.login?.isLoggedIn);
  return <div data-testid="redux-test">{String(isLoggedIn)}</div>;
};

describe('ReduxProvider', () => {
  it('provides the Redux store to children', () => {
    render(
      <ReduxProvider>
        <TestComponent />
      </ReduxProvider>
    );

    const element = screen.getByTestId('redux-test');
    
    expect(element).toBeInTheDocument();
    expect(element.textContent).toBe('false');
  });
});
