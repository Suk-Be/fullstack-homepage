import { isAxiosError, translateHttpError } from '@/utils/auth/translateHttpError'; // Pfad ggf. anpassen
import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

describe('isAxiosError', () => {
  it('returns true for an AxiosError', () => {
    const error = {
      isAxiosError: true,
    } as AxiosError;
    expect(isAxiosError(error)).toBe(true);
  });

  it('returns false for non-Axios error objects', () => {
    const error = new Error('Some other error');
    expect(isAxiosError(error)).toBe(false);
  });
});

describe('translateHttpError', () => {
  const createAxiosError = (status: number, message?: string): AxiosError => {
    return {
      isAxiosError: true,
      response: {
        status,
        data: { message },
      },
    } as AxiosError;
  };

  it('translates 401 error', () => {
    const error = createAxiosError(401);
    expect(translateHttpError(error)).toBe('Nicht autorisiert - ggf. ausgeloggt.');
  });

  it('translates 419 error', () => {
    const error = createAxiosError(419);
    expect(translateHttpError(error)).toBe('CSRF-Token nicht gültig (Status: 419).');
  });

  it('translates 422 error with custom message', () => {
    const error = createAxiosError(422, 'E-Mail ist erforderlich.');
    expect(translateHttpError(error)).toBe('E-Mail ist erforderlich.');
  });

  it('translates 500 error', () => {
    const error = createAxiosError(500);
    expect(translateHttpError(error)).toBe('Interner Serverfehler. Bitte versuchen Sie es später erneut.');
  });

  it('translates unknown status', () => {
    const error = createAxiosError(418);
    expect(translateHttpError(error)).toBe('Ein Fehler ist aufgetreten (Status: 418).');
  });

  it('returns network error message if no response', () => {
    const error = {
      isAxiosError: true,
      response: undefined,
    } as AxiosError;

    expect(translateHttpError(error)).toBe('Netzwerkfehler oder Server nicht erreichbar.');
  });

  it('handles native JS Error object', () => {
    const error = new Error('Ein Fehler im Code');
    expect(translateHttpError(error)).toBe('Ein Fehler im Code');
  });

  it('handles unknown non-error value', () => {
    expect(translateHttpError({})).toBe('Ein unbekannter Fehler ist aufgetreten.');
  });
});
