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

// registration form
// fyi: Laravel returns field-specific validation errors in the errors object (for status 422)
export type RegisterResponse =
  | { success: true; message: string }
  | { success: false; message: string; fieldErrors?: { [key: string]: string[] } };

export type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
};
