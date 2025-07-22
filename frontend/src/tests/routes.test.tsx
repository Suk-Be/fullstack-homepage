import ResetPasswordPage from '@/pages/ResetPasswordPage';
import { store } from '@/store';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { registeredUserData } from './mocks/data';
import { db } from './mocks/db';
import { navigateTo } from './utils/testRenderUtils';

describe('routes', () => {
  beforeEach(() => {
      db.user.create({
          id: registeredUserData.id,
          name: registeredUserData.name,
          email: registeredUserData.email,
      });
  });

  it.each([
    {
      path: '/',
      elementHeadline: /suk-be jang/i,
      component: 'HomePage',
      level: 1
    },
    {
      path: '/impressum',
      elementHeadline: /impressum/i,
      component: 'ImprintPage',
      level: 1
    },
    
    {
      path: '/template-engine',
      elementHeadline: /layout presets/i,
      component: 'ProjectTemplateEnginePage',
      level: 2
    },
    {
      path: '/playground',
      elementHeadline: /playground/i,
      component: 'PlaygroundPage',
      level: 1
    },
    {
      path: '/does-not-exist',
      elementHeadline: /seite nicht gefunden/i,
      component: 'ErrorPage',
      level: 5
    }

  ])
  ('should render $component with $path', async ({path, elementHeadline, level}: {path: string, elementHeadline: RegExp | string, level: number}) => {
    navigateTo({
      route: path, 
      preloadedState: { 
        login: {
          isLoggedIn: true, 
          isLoading: false
        }
      }
    });
    const heading = await screen.findByRole('heading', { name: elementHeadline, level: level }); 
    expect(heading).toBeInTheDocument();
  });

  it('should render the ResetPasswordPage', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/reset-password?token=test123&email=test@example.com']}>
          <ResetPasswordPage />
        </MemoryRouter>
      </Provider>
    );
    
    const heading = await screen.findByRole('heading', { name: /Passwort zurücksetzen/i });
    expect(heading).toBeInTheDocument();
  });
  
});
