import AuthInitializer from '@/providers/AuthInitializer';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';

vi.mock('@/hooks/auth/useAuthInit', () => ({
  useAuthInit: vi.fn(), 
}));

import { useAuthInit } from '@/hooks/auth/useAuthInit';

describe('AuthInitializer', () => {
  beforeEach(() => {
    (useAuthInit as vi.Mock).mockClear();
  });

  it('should call useAuthInit hook when rendered', () => {
    render(<AuthInitializer><div>Test Child</div></AuthInitializer>);

    expect(useAuthInit).toHaveBeenCalledTimes(1);
  });

  it('should render its children', () => {
    const { getByText } = render(
      <AuthInitializer>
        <span>Hello World</span>
      </AuthInitializer>
    );

    expect(getByText('Hello World')).toBeInTheDocument();
  });
});