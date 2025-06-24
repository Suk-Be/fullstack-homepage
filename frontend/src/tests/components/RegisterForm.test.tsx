import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe } from 'vitest';
import { RegisterForm } from '../../components/RegisterForm';
import { db } from '../mocks/db';

const registeredUserData = {
    id: '1',
    name: 'John Doe',
    email: 'existing@example.com',
    password: 'password123',
};

const seedRegisteredUser = db.user.create(registeredUserData);

describe('RegisterForm', () => {
    it('should render a hint if the user already exists', async () => {
        // 🔁 Seed user
        seedRegisteredUser;
        const user = userEvent.setup();
        render(<RegisterForm />);
        const nameInput = screen.getByPlaceholderText(/name/i);
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText('Password');
        const passwordConfirmationInput = screen.getByPlaceholderText('Confirm Password');
        const registerButton = screen.getByRole('button', { name: /register/i });
        await user.clear(nameInput);
        await user.type(nameInput, registeredUserData.name);
        await user.clear(emailInput);
        await user.type(emailInput, registeredUserData.email);
        await user.clear(passwordInput);
        await user.type(passwordInput, registeredUserData.password);
        await user.clear(passwordConfirmationInput);
        await user.type(passwordConfirmationInput, registeredUserData.password);
        await user.click(registerButton);

        const error = await screen.findByText(/Registration failed. Please try again./i);
        expect(error).toBeInTheDocument();
    });
});
