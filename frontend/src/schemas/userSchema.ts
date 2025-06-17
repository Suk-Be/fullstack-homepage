import { z } from 'zod';

export const UserSchema = z.object({
    id: z.union([z.string().uuid(), z.number()]),
    name: z.string().min(1, 'Name cannot be empty'),
    email: z.string().min(8, 'Password must be at least 8 characters long'),
    email_verified_at: z.string().datetime().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const UsersSchema = z.array(UserSchema);
export type Users = z.infer<typeof UsersSchema>;
