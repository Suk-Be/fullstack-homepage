import { screen } from '@testing-library/react';
import ToggleTeaser from '../../../components/auth';
import { renderWithProviders } from '../../utils/testRenderUtils';

describe('ToggleTeaser', () => {

  it('renders SignIn if not logged in', () => {
    renderWithProviders(<ToggleTeaser />);
    expect(screen.getByRole('heading', {name: 'Anmelden'})).toBeInTheDocument();
  });

  it('renders to Accordion if logged in', async () => {
    const loggedInState = {login: {isLoggedIn: true}}
    renderWithProviders(<ToggleTeaser />, {preloadedState: loggedInState});

    expect(screen.getByText('Template Engine')).toBeInTheDocument();
  });
});
