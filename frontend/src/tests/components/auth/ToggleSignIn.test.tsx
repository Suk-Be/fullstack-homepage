import ToggleSignIn from '@/components/auth/Toggles';

import loginReducer from '@/store/loginSlice';
import userGridReducer from '@/store/userGridSlice';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

describe('ToggleSignIn', () => {
    const renderUtils = () => {
      const user = userEvent.setup();

      const store = configureStore({
        reducer: {
          login: loginReducer,
          userGrid: userGridReducer,
        },
      });

      render(
        <Provider store={store}>
          <ToggleSignIn />
        </Provider>
      );

      return { user };
  };

  it('renders SignIn by default', () => {
    renderUtils();
    expect(screen.getByRole('heading', { name: 'Anmelden' })).toBeInTheDocument();
  });

  it('toggles to SignUp when SignIn button is clicked', async () => {
    const { user } = renderUtils();
    await user.click(screen.getByTestId('button-switch-to-sign-up'));
    expect(screen.getByRole('heading', { name: 'Registrieren' })).toBeInTheDocument();
  });

  it('toggles back to SignIn when SignUp button is clicked', async () => {
    const { user } = renderUtils();

    // To SignUp
    await user.click(screen.getByTestId('button-switch-to-sign-up'));
    expect(screen.getByRole('heading', { name: 'Registrieren' })).toBeInTheDocument();

    // Back to SignIn
    await user.click(screen.getByTestId('button-switch-to-sign-in'));
    expect(screen.getByRole('heading', { name: 'Anmelden' })).toBeInTheDocument();
  });
});

