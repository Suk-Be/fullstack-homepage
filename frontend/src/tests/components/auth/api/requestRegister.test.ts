import requestMe from '@/components/auth/requests/requestMe';
import requestRegister from '@/components/auth/requests/requestRegister';
import { BaseClient } from '@/plugins/axios';
import { userLoggedAdmin } from '@/tests/mocks/api';
import { registeredUserData } from '@/tests/mocks/data';
import { db } from '@/tests/mocks/db';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mocks
vi.mock('@/utils/recaptcha/recaptchaToken', () => ({
    default: vi.fn(async () => 'mocked-recaptcha-token'),
}));

vi.mock('@/utils/auth/initializeCookies', () => ({
    default: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/utils/auth/resetCookiesOnResponseError', () => ({
    default: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/plugins/axios', () => ({
    BaseClient: { post: vi.fn(), defaults: { baseURL: 'http://localhost:8000/api' } },
}));
vi.mock('@/components/auth/requests/requestMe', () => ({ default: vi.fn() }));
vi.mock('@/utils/auth/setResponseValidationError', () => ({ setResponseValidationError: vi.fn() }));

const mockPost = BaseClient.post as unknown as ReturnType<typeof vi.fn>;
const mockRequestMe = requestMe as unknown as ReturnType<typeof vi.fn>;
const mockSetResponseValidationError = setResponseValidationError as unknown as ReturnType<
    typeof vi.fn
>;

describe('requestRegister', () => {
    const validForm = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'securepassword',
        password_confirmation: 'securepassword',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('registriert einen neuen Benutzer erfolgreich', async () => {
        mockPost.mockResolvedValue({ data: { message: 'Die Registrierung hat geklappt!' } });
        mockRequestMe.mockResolvedValue({ success: true, userId: userLoggedAdmin, role: 'admin' });

        const result = await requestRegister({ form: validForm });

        expect(result.success).toBe(true);
        expect(result.message).toBe('Die Registrierung hat geklappt!');
        if (result.success) {
            expect(result.userId).toBe(userLoggedAdmin);
        }
        expect(initializeCookies).toHaveBeenCalled();
    });

    it('gibt einen Validierungsfehler zurück, wenn E-Mail schon existiert', async () => {
        db.user.create(registeredUserData);

        mockPost.mockRejectedValue(new Error('Email exists'));
        mockSetResponseValidationError.mockReturnValue({
            success: false,
            message: 'Die E-Mail Adresse ist bereits vergeben. Bitte nutzen Sie eine andere.',
        });

        const result = await requestRegister({
            form: { ...validForm, email: registeredUserData.email },
        });

        expect(result.success).toBe(false);
        expect(result.message).toBe(
            'Die E-Mail Adresse ist bereits vergeben. Bitte nutzen Sie eine andere.',
        );
        expect(resetCookiesOnResponseError).toHaveBeenCalled();
    });
});
