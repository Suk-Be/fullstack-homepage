import { vi } from 'vitest';

const { mockWebGet, mockApiGet } = vi.hoisted(() => ({
    mockWebGet: vi.fn(),
    mockApiGet: vi.fn(),
}));

vi.mock('@/plugins/axios', () => ({
    __esModule: true, // wichtig für default Export
    default: { get: mockApiGet, post: vi.fn() }, // default export = API Client
    BaseClient: { get: mockWebGet, post: vi.fn() }, // benannter Export
    ApiClient: { get: mockApiGet, post: vi.fn() }, // benannter Export
}));

import ApiClient, { BaseClient } from '@/plugins/axios';
import initializeCookies, { __testOnlyReset } from '@/utils/auth/initializeCookies';

describe('initializeCookies', () => {
    // mock last time the initializeCookies has been called
    const initialTime = new Date('2000-01-01T00:00:00Z').getTime();

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(initialTime);
        __testOnlyReset();

        const mockWebGet = BaseClient.get as unknown as ReturnType<typeof vi.fn>;
        const mockApiGet = ApiClient.get as unknown as ReturnType<typeof vi.fn>;

        mockWebGet.mockResolvedValue({});
        mockApiGet.mockResolvedValue({});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should clear cookies and call axios when enough time has passed', async () => {
        const mockWebGet = BaseClient.get as unknown as ReturnType<typeof vi.fn>;

        await initializeCookies();

        expect(mockWebGet).toHaveBeenCalledWith(
            '/api/csrf-cookie',
            expect.objectContaining({ withCredentials: true }),
        );

        const notEnoughTimePassed = 3000;
        const enoughTimePassed = 5001;

        // within throttle period
        vi.setSystemTime(initialTime + notEnoughTimePassed);
        await initializeCookies();
        expect(mockWebGet).toHaveBeenCalledTimes(1);

        // throttle period passed, new call
        vi.setSystemTime(initialTime + enoughTimePassed);
        await initializeCookies();
        expect(mockWebGet).toHaveBeenCalledTimes(2);
    });
});
