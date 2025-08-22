import ReduxProvider from '@/providers/ReduxProvider';
import { useAppSelector } from '@/store/hooks';
import { selectIsLoggedIn } from '@/store/selectors/loginSelectors';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const TestComponent = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  
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
