import { BaseClient } from '@/plugins/axios';
import { LoginErrorResponse, LoginSuccessResponse } from '@/types/entities';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';

const requestMe = async (): Promise<LoginSuccessResponse | LoginErrorResponse> => {
    try {
        const response = await BaseClient.get('/me');
        const user = response.data.data.user;

        const responseObj = setResponseValidationSuccess('User daten geholt und gelogged!');

        return {
            ...responseObj,
            userId: user.id,
            role: user.role,
        };
    } catch (error: unknown) {
        return setResponseValidationError(error);
    }
};

export default requestMe;
