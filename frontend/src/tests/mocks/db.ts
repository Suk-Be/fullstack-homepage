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
