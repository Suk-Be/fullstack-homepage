import LaravelApiClient from '@/plugins/axios';
import { LoginErrorResponse, LoginSuccessResponse } from '@/types/entities';
import { User } from '@/types/Redux';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';

const requestMe = async (): Promise<LoginSuccessResponse | LoginErrorResponse> => {
    try {
        const { data: user } = await LaravelApiClient.get<User>('/me');
        const responseObj = setResponseValidationSuccess('User daten geholt und gelogged!');

        return {
            ...responseObj,
            userId: user.id,
        };
    } catch (error: unknown) {
        return setResponseValidationError(error);
    }
};

export default requestMe;
