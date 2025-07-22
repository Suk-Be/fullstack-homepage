
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { navigateTo } from './utils/testRenderUtils';

describe('routes', () => {
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
    // Text Website: Ungültiger oder fehlender Passwort-Reset-Token. 
    // if caling route with no token provided by backend
    {
      path: '/reset-password',
      elementHeadline: /Ungültiger oder fehlender Passwort-Reset-Token./i,
      component: 'ResetPasswordPage',
      level: 5
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
});
