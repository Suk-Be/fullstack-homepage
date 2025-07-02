import { http, HttpResponse } from 'msw';
import ErrorMessages from '../../data/ErrorMessages';
import SuccessMessages from '../../data/SuccessMessages';
import { forgotPasswordResponseSchema } from '../../schemas/forgotPasswordSchema';
import { loginResponseSchema } from '../../schemas/loginSchema';
import { registerResponseSchema } from '../../schemas/registerSchema';
import { UserSchema } from '../../schemas/userSchema';
import apiBaseUrl from '../../utils/apiBaseUrl';
import { registeredUserData } from './data';
import { db } from './db';

const api = apiBaseUrl();

interface ResetPasswordRequestBody {
    password: string;
    password_confirmation: string;
    token: string;
    email: string;
}

export const handlers = [
    // 1. CSRF cookie request
    http.get(`${api}/csrf-cookie`, () => {
        // Simulate the cookie
        document.cookie = 'XSRF-TOKEN=mocked-csrf-token; Path=/';

        return HttpResponse.json(
            { message: 'CSRF cookie set' },
            {
                status: 204,
            },
        );
    }),

    http.post(`${api}/auth/spa/register`, async (ctx) => {
        const body = (await ctx.request.json()) as {
            email: string;
            name: string;
            password: string;
            password_confirmation: string;
        };

        const parseResult = registerResponseSchema.safeParse(body);

        if (!parseResult.success) {
            return HttpResponse.json(
                {
                    message: 'Invalid data',
                    errors: parseResult.error.flatten(),
                },
                { status: 422 },
            );
        }

        // Mock error response for existing user registration
        if (body.email === registeredUserData.email) {
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

    http.get(`${api}/me`, ({ request }) => {
        const csrfHeader = request.headers.get('X-XSRF-TOKEN');

        // Mock error CSRF token
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

    http.post(`${api}/auth/spa/login`, async (ctx) => {
        const body = await ctx.request.json();
        const parseResult = loginResponseSchema.safeParse(body);

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

    http.post(`${api}/auth/spa/forgot-password`, async (ctx) => {
        const body = (await ctx.request.json()) as { email: string };
        const parseResult = forgotPasswordResponseSchema.safeParse(body);

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

    http.post(`${api}/auth/spa/reset-password`, async ({ request }) => {
        const body = (await request.json()) as ResetPasswordRequestBody;

        if (body.password !== body.password_confirmation) {
            HttpResponse.json({
                success: false,
                message: ErrorMessages.ResetPassword.password,
                errors: {
                    password: [ErrorMessages.ResetPassword.password],
                    password_confirmation: [ErrorMessages.ResetPassword.password_confirmation],
                },
            });
        }

        return HttpResponse.json({
            success: true,
            message: SuccessMessages.ResetPassword.requestSuccess,
            body,
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
