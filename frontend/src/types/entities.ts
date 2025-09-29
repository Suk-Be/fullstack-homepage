export interface Protointerface {
    id: number;
    name: string;
}

// products of protointerface pages
export interface Product {
    id: number;
    name: string;
    price: number;
    protointerfaceId: number;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface LoginSuccessResponse {
    success: true;
    message?: string | undefined;
    userId: number;
    role: 'admin' | 'user';
}

export interface LoginErrorResponse {
    success: false;
    message?: string;
    fieldErrors?: Record<string, string[]>;
}
