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

    // server.listen();

    server.listen({ onUnhandledRequest: 'bypass' }); // Keep 'bypass' for clarity

    // THIS IS THE KEY DEBUGGING LISTENER
    // server.events.on('request:start', ({ request }) => {
    //     console.log('MSW Saw Request:');
    //     console.log('  Method:', request.method);
    //     console.log('  URL:', request.url);
    //     console.log('  Headers:', Object.fromEntries(request.headers.entries()));
    //     // For POST/PUT, also log the body if it's JSON
    //     if (request.bodyUsed === false && request.method !== 'GET' && request.method !== 'HEAD') {
    //         request
    //             .clone()
    //             .json()
    //             .then((body) => {
    //                 console.log('  Body:', body);
    //             })
    //             .catch(() => {
    //                 console.log('  Body: (could not parse as JSON)');
    //             });
    //     }
    // });

    // server.events.on('request:unhandled', ({ request }) => {
    //   console.error(`❌ Unhandled request: ${request.method} ${request.url}`);
    // });
});

afterEach(() => {
    server.resetHandlers();
    cleanup();
    db.user.deleteMany({ where: {} });
});

afterAll(() => {
    server.close();
});

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
