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
});
