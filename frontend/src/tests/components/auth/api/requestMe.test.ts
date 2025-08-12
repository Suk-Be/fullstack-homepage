import requestMe from '@/components/auth/api/requestMe';
import { server } from '@/tests/mocks/server';
import apiBaseUrl from '@/utils/apiBaseUrl';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

const api = apiBaseUrl();

describe('requestMe', () => {
    it('should fetch user data and return userId when successful', async () => {
        const result = await requestMe();

        expect(result).toBeDefined();
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.userId).toBe(1);
            expect(result.message).toMatch(/geholt/i);
        }
    });

    it('should return fieldErrors and message on 422 validation error', async () => {
        server.use(
            http.get(`${api}/me`, () =>
                HttpResponse.json(
                    {
                        message: 'Validierungsfehler',
                        errors: {
                            email: ['E-Mail ist ungültig.'],
                        },
                    },
                    { status: 422 },
                ),
            ),
        );

        const result = await requestMe();

        expect(result).toEqual({
            success: false,
            message: 'Validierungsfehler',
            fieldErrors: {
                email: ['E-Mail ist ungültig.'],
            },
        });
    });

    it('should return default message for 419 CSRF error without message', async () => {
        server.use(http.get(`${api}/me`, () => HttpResponse.json({}, { status: 419 })));

        const result = await requestMe();

        expect(result).toEqual({
            success: false,
            message: 'CSRF-Token nicht gültig (Status: 419).',
        });
    });

    it('should return specific message for 401 unauthorized error', async () => {
        server.use(
            http.get(`${api}/me`, () =>
                HttpResponse.json(
                    {
                        message: 'Nicht eingeloggt',
                    },
                    { status: 401 },
                ),
            ),
        );

        const result = await requestMe();

        expect(result).toEqual({
            success: false,
            message: 'Nicht eingeloggt',
        });
    });

    it('should return fallback message for unknown error code (e.g. 418)', async () => {
        server.use(
            http.get(`${api}/me`, () =>
                HttpResponse.json(
                    {
                        message: 'Unbekannter Fehler',
                    },
                    { status: 418 },
                ),
            ),
        );

        const result = await requestMe();

        expect(result).toEqual({
            success: false,
            message: 'Unbekannter Fehler',
        });
    });

    it('should return default network error message when no response exists', async () => {
        server.use(
            http.get(`${api}/me`, () => {
                throw new Error('Netzwerk down');
            }),
        );

        const result = await requestMe();

        expect(result).toEqual({
            success: false,
            message: 'Netzwerk down',
        });
    });
});
