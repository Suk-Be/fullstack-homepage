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
    // http.get(`${api}/csrf-cookie`, () => {
    http.get(`${api}/csrf-cookie`, () => {
        // Simulate the cookie directly (js-cookie reads from document.cookie)
        // console.log('>>>> DEBUGGING MSW: create cookie!');
        document.cookie = 'XSRF-TOKEN=mocked-csrf-token; Path=/';

        return HttpResponse.json(
            { message: 'CSRF cookie set' },
            {
                status: 204,
            },
        );
    }),

    // Registration request
    // http.post(`${api}/auth/spa/register`, async (ctx) => {
    http.post(`${api}/auth/spa/register`, async (ctx) => {
        // console.log('>>>> DEBUGGING MSW: register call');
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
            // console.log('>>>> DEBUGGING MSW: same email found');
            return HttpResponse.json(
                {
                    message: ErrorMessages.SignUp.responseEmail,
                    errors: {
                        email: [ErrorMessages.SignUp.responseEmail],
                    },
                },
                { status: 422 },
            );
        }

        const { email, name, password, password_confirmation } = body;

        // successful user creation
        db.user.create({
            id: String(Date.now()),
            email,
            name,
            password,
            password_confirmation,
        });

        return HttpResponse.json({ id: 1, name, email }, { status: 201 });
    }),

    // me request
    // http.get(`${api}/me`, ({ request }) => {
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
    // http.post(`${api}/auth/spa/login`, async (ctx) => {
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
            return HttpResponse.json(
                {
                    message: ErrorMessages.SignIn.responseEmail,
                    errors: {
                        email: [ErrorMessages.SignIn.responseEmail],
                    },
                },
                { status: 422 },
            );
        }

        return HttpResponse.json({ token: 'fake-token', user, status: 200 });
    }),

    // forgot-password request
    // http.post(`${api}/auth/spa/forgot-password`, async (ctx) => {
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
            // console.error('[MSW] No user found with email:', body.email);
            return HttpResponse.json(
                {
                    success: false,
                    message: 'Es konnte kein Benutzer mit dieser E-Mail-Adresse gefunden werden.',
                },
                { status: 422 },
            );
        }

        return HttpResponse.json({
            success: true,
            message: 'Passwort-Reset-Link wurde gesendet!',
        });
    }),

    // fallback for catching future route mismatches during test debugging
    http.post('*', async ({ request }) => {
        console.warn('❌ inside handler Unmatched POST request intercepted by fallback:');
        console.warn('URL:', request.url);
        console.warn('Origin:', request.headers.get('origin'));
        const cloned = request.clone();
        try {
            const body = await cloned.json();
            console.warn('Body:', body);
        } catch {
            console.warn('Body: not JSON');
        }
        return HttpResponse.json({ message: 'Unhandled request' }, { status: 500 });
    }),
];
