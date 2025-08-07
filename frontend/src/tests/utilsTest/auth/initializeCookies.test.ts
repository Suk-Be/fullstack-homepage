import initializeCookies, { __testOnlyReset } from '@/utils/auth/initializeCookies';
import axios from 'axios';
import { vi } from 'vitest';

describe('initializeCookies', () => {
  let cookieStore: Record<string, string> = {};
  // mock last time the initializeCookies has been called
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
      get: () => Object
                .entries(cookieStore)
                .map(([key, val]) =>`${key}=${val}`)
                .join(';'),
      set: (cookie: string) => {
        const [pair, ...attrs] = cookie.split(';').map(s => s.trim());
        const [key, val] = pair.split('=');

        const expiresAttr = attrs.find(attr => attr.toLowerCase().startsWith('expires='));
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
    const axiosGetSpy = vi.spyOn(axios, 'get').mockResolvedValue({}); // mock setCookies(), resetIsCsrfFetchedAndResetCookies()
    const notEnoughTime = 3000; 
    const enoughTime = 5001; 

    await initializeCookies();

    expect(axiosGetSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/csrf-cookie'), 
      expect.objectContaining({}) // axiosGetSpy result
    );

    // axiosGetSpy can only be called every 5 Seconds (throtte time)
    vi.setSystemTime(initialTime + notEnoughTime);
    await initializeCookies();
    expect(axiosGetSpy).toHaveBeenCalledTimes(1);

    // Move time out of throttle period, new call
    vi.setSystemTime(initialTime + enoughTime);
    await initializeCookies();
    expect(axiosGetSpy).toHaveBeenCalledTimes(2);
  });
});
