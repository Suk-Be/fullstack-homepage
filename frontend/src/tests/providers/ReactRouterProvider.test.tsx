import mockedRoutes from '@/tests/mocks/mockedRoutes';
import { describe, expect, it, vi } from 'vitest';

// Mock vor allen anderen Imports
vi.mock('@/routes', () => ({
    default: mockedRoutes,
}));

import ReactRouterProvider from '@/providers/ReactRouterProvider';
import { render, screen } from '@testing-library/react';

describe('ReactRouterProvider', () => {
    it('renders without crashing', () => {
        render(<ReactRouterProvider />);
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
});
