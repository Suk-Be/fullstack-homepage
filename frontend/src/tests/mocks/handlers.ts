import { http, HttpResponse } from 'msw';
import { db } from './db';

export const handlers = [
    http.get('/csrf-cookie', () =>
        HttpResponse.json(null, {
            status: 204,
            headers: {
                'Set-Cookie': 'XSRF-TOKEN=mocked-csrf-token; Path=/; HttpOnly',
            },
        }),
    ),

    http.post('/auth/spa/register', async ({ request }: { request: Request }) => {
        const token = request.headers.get('x-xsrf-token');

        if (token !== 'mocked-csrf-token') {
            return HttpResponse.json({ message: 'CSRF token mismatch' }, { status: 419 });
        }

        const body = await request.json();
        const existingUser = db.user.findFirst({
            where: { email: { equals: body.email } },
        });

        if (existingUser) {
            return HttpResponse.json({ message: 'User already exists' }, { status: 422 });
        }

        const newUser = db.user.create({
            id: crypto.randomUUID(),
            name: body.name,
            email: body.email,
            password: body.password,
        });

        return HttpResponse.json({ user: newUser }, { status: 201 });
    }),
];
