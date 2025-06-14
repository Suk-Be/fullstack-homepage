import { screen } from '@testing-library/react';
import { default as userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import SignIn from '../../../components/auth/SignIn';
import ErrorMessages from '../../../data/ErrorMessages';
import apiBaseUrl from '../../../utils/apiBaseUrl';
import { registeredUserData } from '../../mocks/data';
import { db } from '../../mocks/db';
import { server } from '../../mocks/server';
import { renderWithProviders } from '../../utils';

describe('SignIn component', () => {
    const renderUtils = () => {
        const toggleAuth = vi.fn(() => true);
        renderWithProviders(<SignIn onToggleAuth={toggleAuth} />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/passwort/i);
        const submitButton = screen.getByTestId('form-button-login');
        return {
            emailInput,
            passwordInput,
            submitButton,
        };
    };

    it('should log in successfully with valid credentials', async () => {
        const { emailInput, passwordInput, submitButton } = renderUtils();

        db.user.create({
            id: registeredUserData.id,
            email: registeredUserData.email,
            password: registeredUserData.password,
        });

        await userEvent.type(emailInput, registeredUserData.email);
        await userEvent.type(passwordInput, registeredUserData.password);
        await userEvent.click(submitButton);

        // mock click event
        const response = await fetch(`${apiBaseUrl}/auth/spa/login`, {
            method: 'POST',
            body: JSON.stringify({
                email: registeredUserData.email,
                password: registeredUserData.password,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        expect(response.status).toBe(200);
    });

    it('shows field error if login fails with 422', async () => {
        const { emailInput, passwordInput, submitButton } = renderUtils();

        server.use(
            http.post(`${apiBaseUrl}/auth/spa/login`, async () => {
                return HttpResponse.json(
                    {
                        message: 'Validation failed',
                        errors: {
                            email: ['Ungültige E-Mail oder Passwort.'],
                        },
                    },
                    { status: 422 },
                );
            }),
        );

        await userEvent.type(emailInput, 'wrong@example.com');
        await userEvent.type(passwordInput, 'wrongpassword');
        await userEvent.click(submitButton);

        expect(
            await screen.findByText(
                /Diese E-Mail ist nicht registriert oder das Passwort ist falsch./i,
            ),
        ).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
    });

    it('shows validation error on empty inputs (frontend)', async () => {
        const { submitButton } = renderUtils();

        await userEvent.click(submitButton);

        expect(await screen.findByText(ErrorMessages.SignIn.email)).toBeInTheDocument();
        expect(await screen.findByText(ErrorMessages.SignIn.email)).toBeInTheDocument();
    });
});
