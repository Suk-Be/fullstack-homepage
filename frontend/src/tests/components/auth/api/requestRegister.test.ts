import requestRegister from '@/components/auth/api/requestRegister';
import { registeredUserData } from '@/tests/mocks/data';
import { db } from '@/tests/mocks/db';
import initializeCookies from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/auth/initializeCookies', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/utils/auth/resetCookiesOnResponseError', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

describe('requestRegister', () => {
  const validForm = {
    email: 'newuser@example.com',
    name: 'New User',
    password: 'securepassword',
    password_confirmation: 'securepassword',
  };

  it('registriert einen neuen Benutzer erfolgreich', async () => {
    const result = await requestRegister({ form: validForm });

    expect(result.success).toBe(true);
    expect(result.message).toBe('Die Registrierung hat geklappt!');
    if (result.success) {
      expect(result.userId).toBe(1);
    }
    expect(initializeCookies).toHaveBeenCalled();
  });

  it('gibt einen Validierungsfehler zurück, wenn E-Mail schon existiert', async () => {
    db.user.create(registeredUserData);

    const result = await requestRegister({
      form: {
        ...validForm,
        email: registeredUserData.email,
      },
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      'Die E-Mail Adresse ist bereits vergeben. Bitte nutzen Sie eine andere.',
    );
    expect(resetCookiesOnResponseError).toHaveBeenCalled();
  });
});
