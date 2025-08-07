import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('logRecoverableError', () => {
  const originalEnv = import.meta.env;

  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    // @ts-ignore – import.meta.env is readonly
    import.meta.env = { ...originalEnv };
  });

  afterEach(() => {
    // @ts-ignore
    import.meta.env = originalEnv;
  });

  it('should log to console.warn in non-production mode', async () => {
    // @ts-ignore
    import.meta.env.MODE = 'development';

    // @ts-ignore
    process.env.NODE_ENV = 'development';

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = new Error('Test error');

    const { logRecoverableError } = await import('@/utils/logger');

    logRecoverableError({
      context: 'TestContext',
      error,
      extra: { info: 'Extra info' },
    });

    expect(warnSpy).toHaveBeenCalledWith(
      '[DEV LOG] TestContext',
      error,
      { info: 'Extra info' },
    );
  });

});
