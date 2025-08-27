import requestLogout from '@/components/auth/api/requestLogout';
import { server } from '@/tests/mocks/server';
import apiBaseUrl from '@/utils/apiBaseUrl';
import { http, HttpResponse } from 'msw';
import toast from 'react-hot-toast';
import { describe, expect, it, vi } from 'vitest';

const api = apiBaseUrl();

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
    it('should return success on valid logout', async () => {
        server.use(
            http.post(`${api}/auth/spa/logout`, () =>
                HttpResponse.json({
                    message: 'Sie haben sich erfolgreich abgemeldet.',
                }),
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
            http.post(`${api}/auth/spa/logout`, () => {
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
