import { forgotPasswordResponseSchema } from '@/schemas/forgotPasswordSchema';
import { loginResponseSchema } from '@/schemas/loginSchema';
import {
    mockBackendGrids,
    mockFailedLoginData,
    mockMatchingEmailForForgotPassword,
    mockMatchingEmailPasswordQueryDB,
    mockMatchingEmailQueryDB,
    mockMe,
    mockNotMatchingEmailForForgotPassword,
    mockNotMatchingPasswordReset,
    mockPasswordReset,
    mockSignUpSuccess,
    mockSignupUserAlreadyExists,
    userLoggedAdmin,
} from '@/tests/mocks/api';
import { db } from '@/tests/mocks/db';
import { apiUrl, baseUrl } from '@/utils/apiBaseUrl';
import { http, HttpResponse } from 'msw';

const api = apiUrl();
const base = baseUrl();

export interface ResetPasswordRequestBody {
    password: string;
    password_confirmation: string;
    token: string;
    email: string;
}

export const handlers = [
    // CSRF cookie request
    http.get(`${base}/api/csrf-cookie`, () => {
        // Simulate the cookie
        document.cookie = 'XSRF-TOKEN=mocked-csrf-token; Path=/';

        return HttpResponse.json({ message: 'CSRF cookie set' }, { status: 204 });
    }),

    // SignUp
    http.post(`${base}/register`, async (ctx) => {
        const body = (await ctx.request.json()) as {
            email: string;
            name: string;
            password: string;
            password_confirmation: string;
        };

        const existingUser = db.user.findFirst(mockMatchingEmailQueryDB(body.email));

        if (existingUser) {
            return HttpResponse.json(mockSignupUserAlreadyExists, { status: 422 });
        }

        // ansonsten User erstellen
        db.user.create({
            id: String(Date.now()),
            ...body,
        });

        const { name, email } = body;

        return HttpResponse.json(mockSignUpSuccess(name, email), { status: 201 });
    }),

    // Login
    http.post(`${base}/login`, async (ctx) => {
        const body = await ctx.request.json();

        const parseResult = loginResponseSchema.safeParse(body);
        if (!parseResult.success) {
            return HttpResponse.json({ message: 'Invalid data' }, { status: 422 });
        }

        const { email, password } = parseResult.data;
        const user = db.user.findFirst(mockMatchingEmailPasswordQueryDB(email, password));

        if (!user) {
            return HttpResponse.json(mockFailedLoginData, { status: 422 });
        }

        return HttpResponse.json({ token: 'fake-token', user, status: 200 });
    }),

    http.post(`${base}/logout`, () => {
        return HttpResponse.json({
            message: 'Sie haben sich erfolgreich abgemeldet.',
            status: 200,
        });
    }),

    // forgot passwort
    http.post(`${base}/forgot-password`, async (ctx) => {
        const body = (await ctx.request.json()) as { email: string };
        const parseResult = forgotPasswordResponseSchema.safeParse(body);

        if (!parseResult.success) {
            return HttpResponse.json({ message: 'Invalid data' }, { status: 422 });
        }

        const user = db.user.findFirst(mockMatchingEmailQueryDB(body.email));

        if (!user) {
            return HttpResponse.json(mockNotMatchingEmailForForgotPassword, { status: 422 });
        }

        return HttpResponse.json(mockMatchingEmailForForgotPassword);
    }),

    // get me data
    http.get(`${base}/me`, () => HttpResponse.json(mockMe, { status: 200 })),

    // reset password
    http.post(`${base}/reset-password`, async ({ request }) => {
        const body = (await request.json()) as ResetPasswordRequestBody;

        if (body.password !== body.password_confirmation) {
            return HttpResponse.json(mockNotMatchingPasswordReset);
        }

        return HttpResponse.json(mockPasswordReset(body));
    }),

    // reset grids (only for admin)
    http.delete(`${api}/users/:userId/grids`, ({ params }) => {
        const { userId } = params;

        if (userId === userLoggedAdmin.toString()) {
            return new HttpResponse(null, { status: 204 });
        }

        return HttpResponse.json({ message: 'Authorization Failed' }, { status: 403 });
    }),

    // delete one grid
    http.delete(`${api}/grids/by-layout/:layoutId`, ({ params }) => {
        const { layoutId } = params;

        if (layoutId) {
            return new HttpResponse(null, { status: 204 });
        }

        return HttpResponse.json({ message: 'Ressource not found' }, { status: 404 });
    }),

    // get own grids
    http.get(`${api}/user/grids`, () => {
        return HttpResponse.json({ data: mockBackendGrids }, { status: 201 });
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
