import { formatGridDate } from '@/componentsTemplateEngine/savedGridList/formatGridDate';
import { describe, expect, it, vi } from 'vitest';

describe('formatGridDate', () => {
  // mock system date to be 25. August 2025
  const mockDate = new Date('2025-08-25T14:30:00.000Z');

  // use system date mock
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('returns "today", if timestamp is from today', () => {
    // timestamp today, but with different time
    const todayTimestamp = '2025-08-25T10:00:00.000Z';
    const result = formatGridDate(todayTimestamp);
    expect(result).toBe('today, 12:00 pm');
  });

  it('returns "yesterday", if timestamp is from yesterday', () => {
    const yesterdayTimestamp = '2025-08-24T00:45:00.000Z';
    const result = formatGridDate(yesterdayTimestamp);
    expect(result).toBe('yesterday, 2:45 am');
  });

  it('returns date format, if timestamp is older than yesterday', () => {
    // Timestamp von vor zwei Tagen
    const oldTimestamp = '2025-08-23T08:15:00.000Z';
    const result = formatGridDate(oldTimestamp);

    // Beachten Sie, dass das Datumsformat von der Locale abhängt
    // Hier wird das deutsche Standardformat "TT.MM.JJJJ" erwartet

    expect(result).toBe('23.8.2025, 10:15 am');
  });

  it('sollte mit einem Timestamp im Millisekunden-Format umgehen können', () => {
    const nowTimestamp = Date.now();
    const result = formatGridDate(nowTimestamp);
    expect(result).toContain('today');
  });

  it('sollte mit einem Timestamp im ISO 8601-String-Format umgehen können', () => {
    const isoTimestamp = '2025-08-25T07:05:00.000Z';
    const result = formatGridDate(isoTimestamp);

    expect(result).toBe('today, 9:05 am');
  });
});