import headers, { registerHeaders } from '@/utils/auth/requestHeaders';
import { describe, expect, it } from 'vitest';

describe('headers', () => {
  it('should contain the default headers', () => {
    expect(headers).toEqual({
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  });
});

describe('registerHeaders', () => {
  it('should return headers including X-XSRF-TOKEN', () => {
    const csrfToken = 'dummy-token-123';
    const result = registerHeaders(csrfToken);

    expect(result).toEqual({
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': 'dummy-token-123',
    });
  });

  it('should return empty string for X-XSRF-TOKEN if no token is passed', () => {
    const result = registerHeaders('');
    expect(result['X-XSRF-TOKEN']).toBe('');
  });
});
