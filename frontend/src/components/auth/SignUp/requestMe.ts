import LaravelApiClient from '../../../plugins/axios';
import { User } from '../../../types/User';
import { setResponseValidationError } from '../../../utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '../../../utils/auth/setResponseValidationSuccess';

const requestMe = async (shouldFetchUser = false) => {
    if (shouldFetchUser) {
        try {
            await LaravelApiClient.get<User>('/me');
            // const { data: user } = await LaravelApiClient.get<User>('/me');
            // console.log('Erfolgreich angemeldeter User: ', user);
            return setResponseValidationSuccess('User daten geholt und gelogged!');
        } catch (error: unknown) {
            return setResponseValidationError(error);
        }
    }
};

export default requestMe;
