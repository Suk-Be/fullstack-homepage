import requestLogin from '@/components/auth/api/requestLogin';
import { registeredUserData } from '@/tests/mocks/data';
import { db } from '@/tests/mocks/db';
import { server } from '@/tests/mocks/server';
import apiBaseUrl from '@/utils/apiBaseUrl';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

const api = apiBaseUrl();

describe('requestLogin', () => {
    beforeEach(() => {
        db.user.create({
            id: registeredUserData.id,
            name: registeredUserData.name,
            email: registeredUserData.email,
            password: registeredUserData.password,
        });
    });

    it('should return success and userId on valid credentials', async () => {
        server.use(
            http.get(`${api}/me`, () => {
                return HttpResponse.json({
                    id: registeredUserData.id,
                    name: registeredUserData.name,
                    email: registeredUserData.email,
                });
            }),
        );

        const result = await requestLogin({
            email: registeredUserData.email,
            password: registeredUserData.password,
        });

        // console.log('result: ', result.success)

        expect(result.success).toBe(true);
        expect(result.message).toBe('Login erfolgreich!');
    });

    it('should return 422 validation error when login fails', async () => {
        const result = await requestLogin({
            email: 'wrong@example.com',
            password: 'invalid',
        });

        expect(result).toEqual({
            success: false,
            message: "Diese E-Mail ist nicht registriert oder das Passwort ist falsch.",
            fieldErrors: {
                email: ["Diese Anmeldeinformationen stimmen nicht mit den Eingetragenen überein.",],
                password: ["Diese Anmeldeinformationen stimmen nicht mit den Eingetragenen überein.",],                                                                              
            },
        });
    });
});
