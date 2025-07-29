import LaravelApiClient from '@/plugins/axios';
import { User } from '@/types/Redux';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';

interface RequestMeResult {
    success: boolean;
    message: string;
    userId?: number;
}

const requestMe = async (): Promise<RequestMeResult | undefined> => {
    try {
        const { data: user } = await LaravelApiClient.get<User>('/me');
        const responseObj = setResponseValidationSuccess('User daten geholt und gelogged!');

        // console.log('user: ', user);
        return {
            ...responseObj,
            userId: user.id,
        };
    } catch (error: unknown) {
        return setResponseValidationError(error);
    }
};

export default requestMe;
