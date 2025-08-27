export type Prototype = {
    id: number;
    name: string;
};

// products of prototype pages
export type Product = {
    id: number;
    name: string;
    price: number;
    prototypeId: number;
};

export type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type LoginSuccessResponse = {
    success: true;
    message?: string;
    userId?: number;
};

export type LoginErrorResponse = {
    success: false;
    message?: string;
    fieldErrors?: Record<string, string[]>;
};
