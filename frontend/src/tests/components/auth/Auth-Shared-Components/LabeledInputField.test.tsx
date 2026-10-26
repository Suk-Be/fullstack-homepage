import { LabeledTextField } from '@/components/auth/auth-shared-components/LabeledInputField';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('LabeledTextField', () => {
    it('renders label and associates it with the input via htmlFor/id', () => {
        render(<LabeledTextField id="email" name="email" label="Email" value="" type="email" />);

        // Label is linked to the input -> getByLabelText should find it
        const input = screen.getByLabelText('Email');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('id', 'email');
        expect(input).toHaveAttribute('name', 'email');
        expect(input).toHaveAttribute('type', 'email');
    });

    it('passes placeholder, autoComplete, required and disabled props to the input', () => {
        render(
            <LabeledTextField
                id="email"
                name="email"
                label="Email"
                value=""
                type="email"
                placeholder="max@mustermann.com"
                autoComplete="email"
                required
                disabled
            />,
        );

        const input = screen.getByLabelText('Email');
        expect(input).toHaveAttribute('placeholder', 'max@mustermann.com');
        expect(input).toHaveAttribute('autocomplete', 'email');
        expect(input).toBeRequired();
        expect(input).toBeDisabled();
    });

    it('calls onChange when typing', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <LabeledTextField
                id="name"
                name="name"
                label="Benutzername"
                value=""
                onChange={onChange}
            />,
        );

        const input = screen.getByLabelText('Benutzername');
        await user.type(input, 'Max');

        // userEvent.type triggers multiple change events (one per char)
        expect(onChange).toHaveBeenCalled();
    });

    it('renders helperText when provided', () => {
        render(
            <LabeledTextField
                id="email"
                name="email"
                label="Email"
                value=""
                error
                helperText={<span data-testid="email-error">Invalid email</span>}
            />,
        );

        expect(screen.getByTestId('email-error')).toBeInTheDocument();
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('applies rootTestId to FormControl and testId to TextField', () => {
        render(
            <LabeledTextField
                id="email"
                name="email"
                label="Email"
                value=""
                rootTestId={{ 'data-testid': 'root' }}
                testId={{ 'data-testid': 'field' }}
            />,
        );

        expect(screen.getByTestId('root')).toBeInTheDocument();
        expect(screen.getByTestId('field')).toBeInTheDocument();
    });

    it('autofocuses the input when autoFocus is true', () => {
        render(<LabeledTextField id="email" name="email" label="Email" value="" autoFocus />);

        const input = screen.getByLabelText('Email');
        expect(input).toHaveFocus();
    });
});
