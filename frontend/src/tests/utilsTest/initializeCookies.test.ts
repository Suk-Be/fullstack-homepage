import initializeCookies, { __testOnlyReset } from '@/utils/auth/initializeCookies';
import axios from 'axios';
import { vi } from 'vitest';

describe('initializeCookies', () => {
  let cookieStore: Record<string, string> = {};
  const initialTime = new Date('2000-01-01T00:00:00Z').getTime();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(initialTime);
    __testOnlyReset();

    cookieStore = {
      'XSRF-TOKEN': 'abc',
      'laravel_session': 'def',
    };

    // mock document.cookie
    Object.defineProperty(document, 'cookie', {
      get: () => Object.entries(cookieStore).map(([k, v]) =>`${k}=${v}`).join('; '),
      set: (cookie: string) => {
        const [pair, ...attrs] = cookie.split(';').map(s => s.trim());
        const [key, val] = pair.split('=');

        const expiresAttr = attrs.find(a => a.toLowerCase().startsWith('expires='));
        if (expiresAttr) {
          const expiresDate = new Date(expiresAttr.split('=')[1]);
          if (expiresDate.getTime() < Date.now()) { 
            delete cookieStore[key];
            return;
          }
        }

        cookieStore[key] = val;
      },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should clear cookies and call axios when enough time has passed', async () => {
    const axiosGetSpy = vi.spyOn(axios, 'get').mockResolvedValue({});
    const throttleTime = 3000; // throttle time 5000
    const outOfThrottleTime = 5001; // throttle time 5000


    await initializeCookies();

    expect(document.cookie.includes('XSRF-TOKEN')).toBe(false);
    expect(document.cookie.includes('laravel_session')).toBe(false);

    expect(axiosGetSpy).toHaveBeenCalledWith(expect.stringContaining('/api/csrf-cookie'), expect.objectContaining({
      withCredentials: true,
    }));

    // Move time within throttle period, NO new call
    vi.setSystemTime(initialTime + throttleTime);
    await initializeCookies();
    expect(axiosGetSpy).toHaveBeenCalledTimes(1);

    // Move time out of throttle period, new call
    vi.setSystemTime(initialTime + outOfThrottleTime);
    await initializeCookies();
    expect(axiosGetSpy).toHaveBeenCalledTimes(2);
  });
});
