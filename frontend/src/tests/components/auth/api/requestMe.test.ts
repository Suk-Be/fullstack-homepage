import requestMe from '@/components/auth/api/requestMe';
import { BaseClient } from '@/plugins/axios';
import { describe, expect, it, vi } from 'vitest';

describe('requestMe', () => {
    it('should fetch user data and return userId when successful', async () => {
        const result = await requestMe();

        expect(result).toBeDefined();
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.userId).toBe(1);
            expect(result.role).toBe('user');
            expect(result.message).toMatch(/geholt/i);
        }
    });

    it('should catch an error if a request is not possible', async () => {
        const mockError = new Error('Network Error');
        vi.spyOn(BaseClient, 'get').mockRejectedValue(mockError);

        const result = await requestMe();

        expect(result).toBeDefined();
        expect(result.success).toBe(false);
        expect(result.message).toMatch(/error|network/i);
    });
});
