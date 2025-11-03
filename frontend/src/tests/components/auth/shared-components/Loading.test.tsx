import Loading from '@/components/auth/shared-components/Loading'; // Adjust the path if needed
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Loading Component', () => {
    it('renders the loading spinner', () => {
        render(<Loading />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('displays the default loading message', () => {
        render(<Loading />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays a custom loading message', () => {
        const customMessage = 'Lade Daten, Bitte um Geduld ...';
        render(<Loading message={customMessage} />);
        expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('renders without text when message is empty', () => {
        render(<Loading message="" />);
        // Der Spinner bleibt sichtbar
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        // Kein Text angezeigt
        const textElement = screen.queryByText('Loading...');
        expect(textElement).not.toBeInTheDocument();
    });

    it('applies custom size and height', () => {
        const { container } = render(<Loading size={25} height="50px" />);
        const spinner = screen.getByRole('progressbar');

        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveStyle({ width: '25px', height: '25px' });
        expect(container.firstChild).toHaveStyle({ height: '50px' });
    });

    it('applies custom text color', () => {
        render(<Loading textColor="common.white" message="Testfarbe" />);
        const text = screen.getByText('Testfarbe');
        expect(text).toBeInTheDocument();
    });
});
