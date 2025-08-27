import mockedRoutes from '@/tests/mocks/mockedRoutes';
import { vi } from 'vitest';

// Mock vor allen anderen Imports
vi.mock('@/routes', () => ({
  default: mockedRoutes,
}));

import ReactRouterProvider from '@/providers/ReactRouterProvider';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('ReactRouterProvider', () => {
  it('renders without crashing', () => {
    render(<ReactRouterProvider />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});