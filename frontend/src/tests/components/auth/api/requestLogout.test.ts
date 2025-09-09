import requestLogout from '@/components/auth/api/requestLogout';
import { server } from '@/tests/mocks/server';
import { baseUrl } from '@/utils/apiBaseUrl';
import { http, HttpResponse } from 'msw';
import toast from 'react-hot-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const webServer = baseUrl();

vi.mock('react-hot-toast', () => {
    const mockedToast = {
        success: vi.fn(),
    };
    return {
        // default ist der Schlüssel
        default: mockedToast,
    };
});

describe('requestLogout', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    // ✅ Erfolgsfall
    it('should return success on valid logout', async () => {
        server.use(
            http.post(`${webServer}/logout`, () =>
                HttpResponse.json(
                    { message: 'Sie haben sich erfolgreich abgemeldet.' },
                    { status: 200 }
                )
            ),
        );

        const result = await requestLogout();

        expect(result).toEqual({
            success: true,
            message: 'Sie haben sich erfolgreich abgemeldet.',
        });
        expect(toast.success).toHaveBeenCalledWith('Sie haben sich erfolgreich abgemeldet.');
    });

    it('should return error response on server failure', async () => {
        server.use(
            http.post(`${webServer}/logout`, () => {
                return HttpResponse.json({ message: 'Interner Fehler' }, { status: 500 });
            }),
        );

        const result = await requestLogout();

        expect(result).toEqual({
            success: false,
            message: 'Interner Fehler',
        });
    });
});
