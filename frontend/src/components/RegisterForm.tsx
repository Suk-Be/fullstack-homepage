import React, { useState } from 'react';
import LaravelApiClient from '../plugins/axios';

type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

type ValidationErrors = Partial<Record<keyof RegisterFormData, string>>;

export function RegisterForm() {
    const [form, setForm] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [generalError, setGeneralError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' })); // Clear field error
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setGeneralError('');
        setSuccess(false);

        try {
            await LaravelApiClient.post('/auth/spa/register', form);
            setSuccess(true);
        } catch (error: any) {
            const status = error.response?.status;

            if (status === 422 && error.response?.data?.errors) {
                const fieldErrors: ValidationErrors = {};
                const errorsFromBackend = error.response.data.errors;

                for (const key in errorsFromBackend) {
                    fieldErrors[key as keyof RegisterFormData] = errorsFromBackend[key][0];
                }

                setErrors(fieldErrors);
                return;
            }

            setGeneralError('Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} data-testid="form" noValidate>
            <div>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                {errors.name && <p role="alert">{errors.name}</p>}
            </div>
            <div>
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                {errors.email && <p role="alert">{errors.email}</p>}
            </div>
            <div>
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                {errors.password && <p role="alert">{errors.password}</p>}
            </div>
            <div>
                <input
                    name="password_confirmation"
                    type="password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                />
                {errors.password_confirmation && <p role="alert">{errors.password_confirmation}</p>}
            </div>

            <button type="submit">Register</button>

            {generalError && <p role="alert">{generalError}</p>}
            {success && <p>User successfully registered!</p>}
        </form>
    );
}
