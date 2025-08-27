import ButtonUsage from '@/components/Button';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('ButtonUsage', () => {
    it('should render children property', () => {
        render(<ButtonUsage>Click Me</ButtonUsage>);
        const button = screen.getByRole('button');

        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(/click me/i);
    });
});
