/*
Simple example for prototyping msw handlers for validating registration form for existing email from backend.
msw had issues with the response axios error handling, so we use fetch instead.
axios produces a new HttpResponse object for the native response object with status 409.
Which led to a invalid url error in vitest.
*/
import React, { useState } from 'react';
import apiBaseUrl from '../utils/apiBaseUrl';

export function RegisterForm() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            // Step 1: Get CSRF cookie
            await fetch(`${apiBaseUrl}/csrf-cookie`, {
                credentials: 'include',
            });

            // Step 2: Send register request
            const res = await fetch(`${apiBaseUrl}/auth/spa/register`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': 'mocked-csrf-token', // Must match mock
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    password_confirmation: form.password_confirmation,
                }),
            });

            if (res.status === 422) {
                const data = await res.json();
                setError(data.message || 'User already exists');
                return;
            }

            if (!res.ok) {
                throw new Error('Registration failed');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        }
    };

    return (
        <form onSubmit={handleSubmit} data-testid="form">
            <div>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
            </div>
            <div>
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
            </div>
            <div>
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
            </div>
            <div>
                <input
                    name="password_confirmation"
                    type="password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                />
            </div>

            <button type="submit">Register</button>

            {error && <p role="alert">{error}</p>}
            {success && <p>User successfully registered!</p>}
        </form>
    );
}
