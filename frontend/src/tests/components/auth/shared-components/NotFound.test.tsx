import NotFound from '@/components/auth/shared-components/NotFound';
import { renderWithProviders } from '@/tests/utils/testRenderUtils';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const setupEnv = (mode: string) => {
  vi.stubEnv('MODE', mode);
};

describe('NotFound Component', () => {
  const testUtil = ({message = ''}) => {
    renderWithProviders(<NotFound errorMessage={message} />);

    return {
      headline: screen.getByText('Seite nicht gefunden (404)'),
      paragraph: screen.queryByText(/Hoppla!/),
      linkHomePage: screen.queryByRole('link', { name: /Zur Startseite/ }),
    };
  };

  it('renders 404 message in production mode without a technical error message', () => {
    setupEnv('production');
    const {headline, paragraph, linkHomePage} = testUtil({message: ''});

    expect(headline).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
    expect(linkHomePage).toHaveAttribute('href', '/');
  });

  it('renders 404 message in development mode with a technical error as message', () => {
    setupEnv('development');
    const error = 'Something broke in dev';
    const {headline, paragraph, linkHomePage} = testUtil({message: error});

    expect(headline).toBeInTheDocument();
    expect(screen.getByText(error)).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
    expect(linkHomePage).toHaveAttribute('href', '/');
  });
});
