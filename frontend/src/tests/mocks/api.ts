import ErrorMessages from '@/data/ErrorMessages';
import SuccessMessages from '@/data/SuccessMessages';
import { ResetPasswordRequestBody } from './handlers';

// http response mocks

const mockBackendGrids = {
    'uuid-1': {
        layoutId: 'uuid-1',
        timestamp: '2025-09-17T12:00:00.000Z',
        name: 'backendGrid1',
        config: { items: '2', columns: '2', gap: '1', border: '0', paddingX: '0', paddingY: '0' },
    },
    'uuid-2': {
        layoutId: 'uuid-2',
        timestamp: '2025-09-17T12:05:00.000Z',
        name: 'backendGrid2',
        config: { items: '3', columns: '3', gap: '2', border: '1', paddingX: '1', paddingY: '1' },
    },
};

const mockSignUpSuccess = (name: string, email: string) => {
    return {
        id: 1,
        name: name,
        email: email,
        message: 'Die Registrierung hat geklappt!',
    };
};

const mockSignupUserAlreadyExists = {
    message: ErrorMessages.SignUp.responseEmail,
    fieldErrors: {
        email: [ErrorMessages.SignUp.responseEmail],
    },
};

const mockMe = {
    id: 1,
    name: 'Mock User',
    email: 'mock@example.com',
    role: 'user',
};

const mockFailedLoginData = {
    message: ErrorMessages.SignIn.responseEmail,
    errors: {
        email: ['Diese Anmeldeinformationen stimmen nicht mit den Eingetragenen überein.'],
        password: ['Diese Anmeldeinformationen stimmen nicht mit den Eingetragenen überein.'],
    },
};

const mockMatchingEmailQueryDB = (email: string) => {
    return {
        where: {
            email: {
                equals: email,
            },
        },
    };
};

const mockMatchingEmailPasswordQueryDB = (email: string, password: string) => {
    return {
        where: {
            email: { equals: email },
            password: { equals: password },
        },
    };
};

const mockNotMatchingEmailForForgotPassword = {
    success: false,
    message: ErrorMessages.ForgotPassword.responseEmail,
};

const mockMatchingEmailForForgotPassword = {
    success: true,
    message: SuccessMessages.ForgotPassword.requestSuccess,
};

const mockNotMatchingPasswordReset = {
    success: false,
    message: ErrorMessages.ResetPassword.password,
    errors: {
        password: [ErrorMessages.ResetPassword.password],
        password_confirmation: [ErrorMessages.ResetPassword.password_confirmation],
    },
};

const mockPasswordReset = (body: ResetPasswordRequestBody) => {
    return {
        success: true,
        message: SuccessMessages.ResetPassword.requestSuccess,
        body,
    };
};

// user id mocks

const userLoggedInNoAdmin = 999;
const userLoggedAdmin = 123;

export {
    mockBackendGrids,
    mockFailedLoginData,
    mockMatchingEmailForForgotPassword,
    mockMatchingEmailPasswordQueryDB,
    mockMatchingEmailQueryDB,
    mockMe,
    mockNotMatchingEmailForForgotPassword,
    mockNotMatchingPasswordReset,
    mockPasswordReset,
    mockSignUpSuccess,
    mockSignupUserAlreadyExists,
    userLoggedAdmin,
    userLoggedInNoAdmin,
};
