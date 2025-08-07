import { __testOnlyReset, resetIsCsrfFetchedAndResetCookies, setCookies } from '@/utils/auth/initializeCookies';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
vi.mock('@/utils/logger', () => ({
  getAxiosStatus: vi.fn(() => 'MOCK_STATUS'),
  logRecoverableError: vi.fn(),
}));

let cookieStore: Record<string, string> = {};

Object.defineProperty(document, 'cookie', {
  get() {
    return Object.entries(cookieStore)
      .map(([key, val]) => `${key}=${val}`)
      .join('; ');
  },
  set(cookie: string) {
    const [pair, ...attrs] = cookie.split(';').map(s => s.trim());
    const [key, val] = pair.split('=');

    // If expires in past, delete cookie
    const expiresAttr = attrs.find(attr => attr.toLowerCase().startsWith('expires='));
    if (expiresAttr) {
      const expiresDate = new Date(expiresAttr.split('=')[1]);
      if (expiresDate < new Date()) {
        delete cookieStore[key];
        return;
      }
    }
    cookieStore[key] = val;
  },
});

describe('resetIsCsrfFetchedAndResetCookies', () => {
  it('should clear CSRF-related cookies', () => {
    document.cookie = 'XSRF-TOKEN=abc123';
    document.cookie = 'laravel_session=xyz456';

    expect(document.cookie).toContain('XSRF-TOKEN=abc123');
    expect(document.cookie).toContain('laravel_session=xyz456');

    resetIsCsrfFetchedAndResetCookies();

    expect(document.cookie.includes('XSRF-TOKEN=')).toBe(false);
    expect(document.cookie.includes('laravel_session=')).toBe(false);
  });
});

describe('setCookies', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    __testOnlyReset();
  });

  it('should call axios.get once and set isCsrfFetched', async () => {
    (axios.get as any).mockResolvedValueOnce({});

    await setCookies();
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/csrf-cookie'), {
      withCredentials: true,
    });

    // second call should not trigger axios.get again
    await setCookies();
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('should log error if axios.get fails', async () => {
    const { logRecoverableError } = await import('@/utils/logger');
    (axios.get as any).mockRejectedValueOnce(new Error('network'));

    __testOnlyReset();

    await setCookies();
    expect(logRecoverableError).toHaveBeenCalledWith(
      expect.objectContaining({
        context: 'Failed to fetch CSRF cookie',
      })
    );
  });
});
