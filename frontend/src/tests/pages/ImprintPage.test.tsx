import { mockLogInState } from '@/tests/mocks/redux';
import { navigateTo } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('ImprintPage', () => {
    it('should render the imprint contents', async () => {
        navigateTo({
            route: '/impressum',
            preloadedState: mockLogInState,
        });

        const heading = screen.getByRole('heading', {
            name: /impressum/i,
        });
        const paragraph = screen.getByText(/Angaben gemäß § 5 DDG/i);

        expect(heading).toHaveTextContent(/impressum/i);
        expect(paragraph).toBeInTheDocument();
    });
});
