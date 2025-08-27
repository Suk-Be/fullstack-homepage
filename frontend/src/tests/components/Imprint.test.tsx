import Imprint from '@/components/Imprint';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Imprint', () => {
    it('should render a heading', () => {
        render(<Imprint />);
        const heading = screen.getByRole('heading');

        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent(/impressum/i);
    });

    it('should render a paragraph', () => {
        render(<Imprint />);
        const paragraph = screen.getByText(/Angaben gemäß § 5 DDG/i);

        expect(paragraph).toBeInTheDocument();
    });
});
