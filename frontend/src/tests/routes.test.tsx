import HomePage from '@/pages/HomePage';
import ImprintPage from '@/pages/ImprintPage';
import PlaygroundPage from '@/pages/PlaygroundPage';
import ProjectTemplateEnginePresetsPage from '@/pages/ProjectTemplateEngineLayoutExamplesPage';
import ProjectTemplateEnginePage from '@/pages/ProjectTemplateEnginePage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import { store } from '@/store';
import {
    navigateTo,
    renderWithProviders,
    renderWithProvidersDOM,
} from '@/tests/utils/testRenderUtils';
import { render, screen } from '@testing-library/react';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { registeredUserData } from './mocks/data';
import { db } from './mocks/db';

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
            page: 'HomePage',
            component: <HomePage />,
            level: 1,
        },
        {
            path: '/impressum',
            elementHeadline: /impressum/i,
            page: 'ImprintPage',
            component: <ImprintPage />,
            level: 1,
        },
        {
            path: '/playground',
            elementHeadline: /playground/i,
            page: 'PlaygroundPage',
            component: <PlaygroundPage />,
            level: 1,
        },
    ])(
        'should render $page with $path',
        async ({
            component,
            path,
            elementHeadline,
            level,
        }: {
            component: ReactElement;
            path: string;
            elementHeadline: RegExp | string;
            level: number;
        }) => {
            renderWithProviders(component, {
                route: path,
                preloadedState: {
                    login: {
                        isLoggedIn: true,
                        isLoading: false,
                    },
                },
            });
            const heading = await screen.findByRole('heading', {
                name: elementHeadline,
                level: level,
            });
            expect(heading).toBeInTheDocument();
        },
    );

    it.each([
        {
            path: '/template-engine',
            elementHeadline: 'Layout Presets',
            page: 'ProjectTemplateEnginePage',
            component: <ProjectTemplateEnginePage />,
            level: 2,
        },
        {
            path: '/template-engine/presets',
            elementHeadline: 'Grid Layout Layout Examples',
            page: 'ProjectTemplateEnginePresetsPage',
            component: <ProjectTemplateEnginePresetsPage />,
            level: 1,
        },
    ])(
        'should render $page with $path',
        async ({
            component,
            path,
            elementHeadline,
            level,
        }: {
            component: ReactElement;
            path: string;
            elementHeadline: RegExp | string;
            level: number;
        }) => {
            renderWithProvidersDOM(component, {
                route: path,
                preloadedState: {
                    login: {
                        isLoggedIn: true,
                        isLoading: false,
                    },
                },
            });
            const heading = await screen.findByRole('heading', {
                name: elementHeadline,
                level: level,
            });
            expect(heading).toBeInTheDocument();
        },
    );

    it('should render ErrorPage if calling a not existing route', async () => {
        navigateTo({
            route: '/does-not-exist',
            preloadedState: {
                login: {
                    isLoggedIn: true,
                    isLoading: false,
                },
            },
        });
        const heading = await screen.findByRole('heading', {
            name: /seite nicht gefunden/i,
            level: 5,
        });
        expect(heading).toBeInTheDocument();
    });

    it('should render the ResetPasswordPage', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter
                    initialEntries={['/reset-password?token=test123&email=test@example.com']}
                >
                    <ResetPasswordPage />
                </MemoryRouter>
            </Provider>,
        );

        const heading = await screen.findByRole('heading', { name: /Passwort zurücksetzen/i });
        expect(heading).toBeInTheDocument();
    });
});
