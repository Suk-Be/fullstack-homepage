import ErrorMessages from '@/data/ErrorMessages';
import SuccessMessages from '@/data/SuccessMessages';
import { ResetPasswordRequestBody } from './handlers';

// user id mocks

const userLoggedInNoAdmin = 999;
const userLoggedAdmin = 123;

// http response mocks

const mockBackendGrids = {
    '04257982-d7a8-3a99-913d-31b4a3b270ed': {
        id: 1,
        name: 'grid_1_0',
        layoutId: '04257982-d7a8-3a99-913d-31b4a3b270ed',
        config: {
            gap: 15,
            items: 1,
            border: 1,
            columns: 2,
            paddingX: 15,
            paddingY: 5,
        },
        timestamp: '2025-09-17T15:51:49.000000Z',
        createdAt: '2025-09-17T15:51:49.000000Z',
        updatedAt: '2025-09-17T15:51:49.000000Z',
    },
    'c3ac2aaa-9fc9-3492-8de4-2c6a9753a5e8': {
        id: 2,
        name: 'grid_1_1',
        layoutId: 'c3ac2aaa-9fc9-3492-8de4-2c6a9753a5e8',
        config: {
            gap: 1,
            items: 7,
            border: 4,
            columns: 3,
            paddingX: 14,
            paddingY: 0,
        },
        timestamp: '2025-09-17T15:51:49.000000Z',
        createdAt: '2025-09-17T15:51:49.000000Z',
        updatedAt: '2025-09-17T15:51:49.000000Z',
    },
    '57614111-2166-3b30-9f72-1d4f09cd81cb': {
        id: 3,
        name: 'grid_1_2',
        layoutId: '57614111-2166-3b30-9f72-1d4f09cd81cb',
        config: {
            gap: 13,
            items: 5,
            border: 2,
            columns: 5,
            paddingX: 7,
            paddingY: 7,
        },
        timestamp: '2025-09-17T15:51:49.000000Z',
        createdAt: '2025-09-17T15:51:49.000000Z',
        updatedAt: '2025-09-17T15:51:49.000000Z',
    },
};

const mockSignUpSuccess = (name: string, email: string) => {
    return {
        id: userLoggedAdmin,
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
    id: userLoggedInNoAdmin,
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
