import { http, HttpResponse } from 'msw';
import apiBaseUrl from '../../utils/apiBaseUrl';
import { registeredUserData } from './data';

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
    http.post(`${apiBaseUrl}/auth/spa/register`, async ({ request }) => {
        const body = (await request.json()) as {
            email: string;
            name: string;
            password: string;
            password_confirmation: string;
        };

        // Mock response of already registered user email
        if (body.email === registeredUserData.email) {
            return HttpResponse.json(
                { message: 'Die E-Mail Adresse ist bereits vergeben.' },
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
];
