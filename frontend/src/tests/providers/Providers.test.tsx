import Providers from '@/providers';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const DummyChild = () => <div data-testid="dummy-child">TestContent</div>;


vi.mock('@/providers/AuthInitializer', () => ({
  default: ({ children }: any) => <>{children}</>,
}));

vi.mock('@/providers/ReactRouterProvider', () => ({
  default: () => <DummyChild />,
}));

describe('Providers', () => {
  it('renders all nested providers without crashing', () => {
    render(<Providers />);
    
    expect(screen.getByTestId('dummy-child')).toBeInTheDocument();
  });
});
