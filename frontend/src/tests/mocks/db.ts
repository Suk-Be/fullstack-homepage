import { factory, primaryKey } from '@mswjs/data';

export const db = factory({
    user: {
        id: primaryKey(String),
        name: String,
        email: String,
        password: String,
        password_confirmation: String,
    },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type User = typeof db.user.create extends (...args: any) => infer R ? R : never;
