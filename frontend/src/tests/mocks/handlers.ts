import { http, HttpResponse } from 'msw';
import ErrorMessages from '../../data/ErrorMessages';
import apiBaseUrl from '../../utils/apiBaseUrl';
import { registeredUserData } from './data';
import { db } from './db';

export const handlers = [
    // 1. CSRF cookie request
    http.get(`${apiBaseUrl}/csrf-cookie`, () => {
        // Simulate the cookie directly (js-cookie reads from document.cookie)
        document.cookie = 'XSRF-TOKEN=mocked-csrf-token; Path=/';

        return HttpResponse.json(
            { message: 'CSRF cookie set' },
            {
                status: 204,
            },
        );
    }),

    // 2. Registration request
    http.post(`${apiBaseUrl}/auth/spa/register`, async (ctx) => {
        const body = (await ctx.request.json()) as {
            email: string;
            name: string;
            password: string;
            password_confirmation: string;
        };

        // Mock response of already registered user email
        if (body.email === registeredUserData.email) {
            return HttpResponse.json(
                {
                    message: ErrorMessages.SignUp.responseEmail,
                },
                { status: 422 },
            );
        }
        // Mock 419 CSRF Token Expired
        if (body.email === 'csrfexpired@example.com') {
            return HttpResponse.json({ message: 'CSRF-Token abgelaufen' }, { status: 419 });
        }

        // Simulate successful registration response
        const { name, email } = body as { name: string; email: string };
        return HttpResponse.json({ id: 1, name, email }, { status: 201 });
    }),

    // Mock GET /api/user after successful registration
    http.get(`${apiBaseUrl}/me`, ({ request }) => {
        const csrfHeader = request.headers.get('X-XSRF-TOKEN');

        // Simulate CSRF token check (optional)
        if (csrfHeader !== 'mocked-csrf-token') {
            return HttpResponse.json({ message: 'Invalid CSRF token' }, { status: 419 });
        }

        // Return mock user data
        return HttpResponse.json(
            {
                id: registeredUserData.id,
                name: registeredUserData.name,
                email: registeredUserData.email,
            },
            { status: 200 },
        );
    }),

    // 3. Login request
    http.post(`${apiBaseUrl}/auth/spa/login`, async (ctx) => {
        const { email, password } = (await ctx.request.json()) as {
            email: string;
            password: string;
        };

        const user = db.user.findFirst({
            where: {
                email: {
                    equals: email,
                },
                password: {
                    equals: password,
                },
            },
        });

        if (!user) {
            return HttpResponse.json({ message: 'Invalid credentials' }, { status: 422 });
        }

        return HttpResponse.json({ token: 'fake-token', user, status: 200 });
    }),
];
