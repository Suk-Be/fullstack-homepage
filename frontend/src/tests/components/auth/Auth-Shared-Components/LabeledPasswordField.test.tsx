import { LabeledPasswordField } from '@/components/auth/auth-shared-components/LabeledPasswordField';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('LabeledPasswordField', () => {
    it('renders label and associates it with the input', () => {
        render(
            <LabeledPasswordField
                id="password"
                name="password"
                label="Passwort"
                value=""
                onChange={() => {}}
                show={false}
                onToggleShow={() => {}}
            />,
        );

        const input = screen.getByLabelText('Passwort');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('id', 'password');
        expect(input).toHaveAttribute('name', 'password');
    });

    it('uses type="password" when show=false and type="text" when show=true', () => {
        const { rerender } = render(
            <LabeledPasswordField
                id="password"
                name="password"
                label="Passwort"
                value=""
                onChange={() => {}}
                show={false}
                onToggleShow={() => {}}
            />,
        );

        expect(screen.getByLabelText('Passwort')).toHaveAttribute('type', 'password');

        rerender(
            <LabeledPasswordField
                id="password"
                name="password"
                label="Passwort"
                value=""
                onChange={() => {}}
                show={true}
                onToggleShow={() => {}}
            />,
        );

        expect(screen.getByLabelText('Passwort')).toHaveAttribute('type', 'text');
    });

    it('calls onToggleShow when the icon button is clicked', async () => {
        const user = userEvent.setup();
        const onToggleShow = vi.fn();

        render(
            <LabeledPasswordField
                id="password"
                name="password"
                label="Passwort"
                value=""
                onChange={() => {}}
                show={false}
                onToggleShow={onToggleShow}
            />,
        );

        // IconButton has no accessible name -> query by role "button"
        // There should be exactly one button inside the adornment.
        const buttons = screen.getAllByRole('button');
        await user.click(buttons[0]);

        expect(onToggleShow).toHaveBeenCalledTimes(1);
    });

    it('renders helperText when provided', () => {
        render(
            <LabeledPasswordField
                id="password"
                name="password"
                label="Passwort"
                value=""
                onChange={() => {}}
                show={false}
                onToggleShow={() => {}}
                error
                helperText={<span data-testid="pw-error">Too short</span>}
            />,
        );

        expect(screen.getByTestId('pw-error')).toBeInTheDocument();
        expect(screen.getByText('Too short')).toBeInTheDocument();
    });

    it('applies testId props to the TextField root element', () => {
        render(
            <LabeledPasswordField
                id="password"
                name="password"
                label="Passwort"
                value=""
                onChange={() => {}}
                show={false}
                onToggleShow={() => {}}
                testId={{ 'data-testid': 'password-field' }}
            />,
        );

        expect(screen.getByTestId('password-field')).toBeInTheDocument();
    });

    it('calls onChange when typing', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <LabeledPasswordField
                id="password"
                name="password"
                label="Passwort"
                value=""
                onChange={onChange}
                show={false}
                onToggleShow={() => {}}
            />,
        );

        await user.type(screen.getByLabelText('Passwort'), 'abc');

        expect(onChange).toHaveBeenCalled();
    });
});
