import { describe, it, expect } from 'vitest';
import { range } from './utils';

describe('utils', () => {
    describe('range', () => {
        it('retrurns correct result from 1-6 range', () => {
            const result = range(1, 6);
            expect(result).toEqual([1, 2, 3, 4, 5]);
        });
        it('retrurns correct result from 41-45 range', () => {
            const result = range(41, 45);
            expect(result).toEqual([41, 42, 43, 44]);
        });
    });
});
