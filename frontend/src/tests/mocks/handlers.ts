import ErrorMessages from '@/data/ErrorMessages';
import SuccessMessages from '@/data/SuccessMessages';
import { forgotPasswordResponseSchema } from '@/schemas/forgotPasswordSchema';
import { loginResponseSchema } from '@/schemas/loginSchema';
import { apiUrl, baseUrl } from '@/utils/apiBaseUrl';
import { http, HttpResponse } from 'msw';
import { db } from './db';

const api = apiUrl();
const base = baseUrl();
export const userLoggedInNoAdmin = 999
export const userLoggedAdmin = 123

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

    http.post(`${base}/register`, async (ctx) => {
        const body = (await ctx.request.json()) as {
            email: string;
            name: string;
            password: string;
            password_confirmation: string;
        };

        const existingUser = db.user.findFirst({
          where: {
              email: {
                  equals: body.email,
              },
          },
        });

        if (existingUser) {
          return HttpResponse.json(
            {
                message: ErrorMessages.SignUp.responseEmail,
                fieldErrors: {
                    email: [ErrorMessages.SignUp.responseEmail],
                },
            },
            { status: 422 },
        );
    }

        // ansonsten User erstellen
        db.user.create({
            id: String(Date.now()),
            ...body,
        });

        return HttpResponse.json(
            {
                id: 1,
                name: body.name,
                email: body.email,
                message: 'Die Registrierung hat geklappt!',
            },
            { status: 201 },
        );
    }),

    http.post(`${base}/login`, async (ctx) => {
        const body = await ctx.request.json();
        // console.log('MSW login handler wurde aufgerufen mit body:', body);

        const parseResult = loginResponseSchema.safeParse(body);

        if (!parseResult.success) {
            return HttpResponse.json({ message: 'Invalid data' }, { status: 422 });
        }

        const { email, password } = parseResult.data;

        const user = db.user.findFirst({
            where: {
                email: { equals: email, },
                password: { equals: password, },
            },
        });

        if (!user) {
            return HttpResponse.json(
                {
                    message: ErrorMessages.SignIn.responseEmail,
                    errors: {
                        email: ['Diese Anmeldeinformationen stimmen nicht mit den Eingetragenen überein.'],
                        password: ['Diese Anmeldeinformationen stimmen nicht mit den Eingetragenen überein.']
                    },
                },
                { status: 422 },
            );
        }

        return HttpResponse.json({ token: 'fake-token', user, status: 200 });
    }),

    http.post(`${base}/logout`, () => {
        return HttpResponse.json({
            message: 'Sie haben sich erfolgreich abgemeldet.',
            status: 200,
        });
    }),

    http.post(`${base}/forgot-password`, async (ctx) => {
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

    // ✅ Erfolgreicher Request
    http.get(`${base}/me`, () =>
      HttpResponse.json(
        {
          id: 1,
          name: 'Mock User',
          email: 'mock@example.com',
        },
        { status: 200 }
      )
    ),

    http.post(`${base}/reset-password`, async ({ request }) => {
        const body = (await request.json()) as ResetPasswordRequestBody;

        if (body.password !== body.password_confirmation) {
          return HttpResponse.json({
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

    http.delete(`${api}/users/:userId/grids`, ({ params }) => {
        const { userId } = params;

        if (userId === userLoggedAdmin.toString()) {
          // response success
          return new HttpResponse(null, { status: 204 });
        }

        // otherwise
        return HttpResponse.json(
          { message: 'Authorization Failed' },
          { status: 403 }
        );
    }),

    http.delete(`${api}/grids/by-layout/:layoutId`, ({ params }) => {
        const { layoutId } = params;

        if (layoutId) {
          // response success
          return new HttpResponse(null, { status: 204 });
        }

        // otherwise
        return HttpResponse.json(
          { message: 'Ressource not found' },
          { status: 404 }
        );
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
