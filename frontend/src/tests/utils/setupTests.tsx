import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { db } from '../mocks/db';
import { server } from '../mocks/server';

beforeAll(() => {
    vi.mock('@mui/icons-material', async () => {
        return {
            Visibility: () => <svg data-testid="VisibilityIcon" />,
            VisibilityOff: () => <svg data-testid="VisibilityOffIcon" />,
            HowToReg: () => <svg data-testid="HowToRegIcon" />,
        };
    });

    vi.mock('@mui/material/Link', () => {
        return {
            __esModule: true,
            default: ({ children, ...props }: any) => (
                <a {...props} data-testid="mui-link">
                    {children}
                </a>
            ),
        };
    });

    Object.defineProperty(window, 'location', {
        writable: true,
        value: {
            ...window.location,
            assign: vi.fn(),
            replace: vi.fn(),
            href: '',
        },
    });

    server.listen();
});

afterEach(() => {
    server.resetHandlers();
    cleanup();
    afterEach(() => {
        db.user.deleteMany({ where: {} });
    });
});

afterAll(() => server.close());

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
