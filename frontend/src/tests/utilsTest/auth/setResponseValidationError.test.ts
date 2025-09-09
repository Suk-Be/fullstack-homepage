import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

describe('setResponseValidationError', () => {
  it('should handle non-Axios errors', () => {
    const err = new Error('Test error');
    const result = setResponseValidationError(err);
    expect(result).toEqual({ success: false, message: 'Test error' });

    const unknown = 'some string';
    const result2 = setResponseValidationError(unknown);
    expect(result2).toEqual({ success: false, message: 'Ein unbekannter Fehler ist aufgetreten.' });
  });

  it('should handle AxiosError without response', () => {
    const axiosError = { isAxiosError: true } as AxiosError;
    const result = setResponseValidationError(axiosError);
    expect(result).toEqual({ success: false, message: 'Netzwerkfehler oder Server nicht erreichbar.' });
  });

  it('should handle AxiosError with 401 status', () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 401, data: { message: 'Unauthorized' } },
    } as AxiosError;
    const result = setResponseValidationError(axiosError);
    expect(result).toEqual({
      success: false,
      message: 'Unauthorized',
    });
  });

  it('should handle AxiosError with 419 status', () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 419, data: { message: '' } },
    } as AxiosError;
    const result = setResponseValidationError(axiosError);
    expect(result).toEqual({
      success: false,
      message: 'CSRF-Token nicht gültig (Status: 419).',
    });
  });

  it('should handle AxiosError with 422 status and fieldErrors', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 422,
        data: { message: 'Validation failed', errors: { email: ['Invalid email'] } },
      },
    } as AxiosError;
    const result = setResponseValidationError(axiosError);
    expect(result).toEqual({
      success: false,
      message: 'Validation failed',
      fieldErrors: { email: ['Invalid email'] },
    });
  });

  it('should handle AxiosError with 500 status', () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 500, data: { message: '' } },
    } as AxiosError;
    const result = setResponseValidationError(axiosError);
    expect(result).toEqual({
      success: false,
      message: 'Interner Serverfehler. Bitte versuchen Sie es später erneut.',
    });
  });

  it('should handle AxiosError with unknown status', () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 418, data: { message: 'Teapot' } },
    } as AxiosError;
    const result = setResponseValidationError(axiosError);
    expect(result).toEqual({
      success: false,
      message: 'Teapot',
    });
  });
});
