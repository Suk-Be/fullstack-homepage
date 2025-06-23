import { http, HttpResponse } from 'msw';
import ErrorMessages from '../../data/ErrorMessages';
import { ForgotPasswordSchema } from '../../schemas/forgotPasswordSchema';
import { LoginSchema } from '../../schemas/loginSchema';
import { RegisterSchema } from '../../schemas/registerSchema';
import { UserSchema } from '../../schemas/userSchema';
import apiBaseUrl from '../../utils/apiBaseUrl';
import { registeredUserData } from './data';
import { db } from './db';

const api = apiBaseUrl();

export const handlers = [
    // 1. CSRF cookie request
    http.get(`${api}/csrf-cookie`, () => {
        // Simulate the cookie directly (js-cookie reads from document.cookie)
        document.cookie = 'XSRF-TOKEN=mocked-csrf-token; Path=/';

        return HttpResponse.json(
            { message: 'CSRF cookie set' },
            {
                status: 204,
            },
        );
    }),

    // Registration request
    http.post(`${api}/auth/spa/register`, async (ctx) => {
        const body = (await ctx.request.json()) as {
            email: string;
            name: string;
            password: string;
            password_confirmation: string;
        };

        const parseResult = RegisterSchema.safeParse(body);

        if (!parseResult.success) {
            return HttpResponse.json(
                {
                    message: 'Invalid data',
                    errors: parseResult.error.flatten(), // helpful for frontend forms
                },
                { status: 422 },
            );
        }

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

    // me request
    http.get(`${api}/me`, ({ request }) => {
        const csrfHeader = request.headers.get('X-XSRF-TOKEN');

        // Simulate CSRF token check (optional)
        if (csrfHeader !== 'mocked-csrf-token') {
            return HttpResponse.json({ message: 'Invalid CSRF token' }, { status: 419 });
        }

        // Return mock user data
        const mockUser = UserSchema.parse({
            id: registeredUserData.id,
            name: registeredUserData.name,
            email: registeredUserData.email,
            email_verified_at: null,
        });

        const result = UserSchema.safeParse(mockUser);

        if (!result.success) {
            return HttpResponse.json({ message: 'Invalid mock user format' }, { status: 500 });
        }

        return HttpResponse.json(mockUser, { status: 200 });
    }),

    // login request
    http.post(`${api}/auth/spa/login`, async (ctx) => {
        const body = await ctx.request.json();
        const parseResult = LoginSchema.safeParse(body);

        if (!parseResult.success) {
            return HttpResponse.json({ message: 'Invalid data' }, { status: 422 });
        }

        const { email, password } = parseResult.data;

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

    // forgot-password request
    http.post(`${api}/auth/spa/forgot-password`, async (ctx) => {
        const body = (await ctx.request.json()) as { email: string };
        const parseResult = ForgotPasswordSchema.safeParse(body);

        if (!parseResult.success) {
            return HttpResponse.json({ message: 'Invalid data' }, { status: 422 });
        }

        const user = db.user.findFirst({
            where: {
                email: {
                    equals: body.email,
                },
            },
        });

        if (!user) {
            console.error('[MSW] No user found with email:', body.email);
            return HttpResponse.json(
                {
                    success: false,
                    message: 'Bitte geben Sie eine gültige Email Adresse an.',
                },
                { status: 422 },
            );
        }

        return HttpResponse.json({
            success: true,
            message: 'Passwort-Reset-Link wurde gesendet!',
        });
    }),
];
