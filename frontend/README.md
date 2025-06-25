# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
    extends: [
        // Remove ...tseslint.configs.recommended and replace with this
        ...tseslint.configs.recommendedTypeChecked,
        // Alternatively, use this for stricter rules
        ...tseslint.configs.strictTypeChecked,
        // Optionally, add this for stylistic rules
        ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
        // other options...
        parserOptions: {
            project: ['./tsconfig.node.json', './tsconfig.app.json'],
            tsconfigRootDir: import.meta.dirname,
        },
    },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
    plugins: {
        // Add the react-x and react-dom plugins
        'react-x': reactX,
        'react-dom': reactDom,
    },
    rules: {
        // other rules...
        // Enable its recommended typescript rules
        ...reactX.configs['recommended-typescript'].rules,
        ...reactDom.configs.recommended.rules,
    },
});
```

## Session and XSRF tokens

Backend is running in laravel and has an own repo called sanctum cookie. It can be found in the sibling folder of this frontend project.

To make this application work got the sanctum-cookie folder and run this command from the console:

```bash
php artisan serve
```

## Unit Testing with React, react router, MUI, vitest und react-testing-library

### esm imported MUI Icons cause issues in vitest that result in testing errors

The main menu can be toggled and uses a not obvious mui icon (composite component). FYI: This issue occurred on almost every test since we are used a react-router memoryRouter to render pages for jsdom that vitest uses.

```bash
vitest error: Error: EMFILE: too many open files '\material-ui-react\node_modules\@mui\icons-material\esm\SettingsInputComponent.js'
```

It can be fixed through mocking the Icons causing the problems

```ts (setupTests.tsx)
beforeAll(() => {
    vi.mock('@mui/icons-material', async () => {
        return {
            Visibility: () => <svg data-testid="VisibilityIcon" />,
            VisibilityOff: () => <svg data-testid="VisibilityOffIcon" />,
        };
    });

    // ... other mocks
});
```

### using react-router Link for MUI Link components caused issues

In the global theme configuration a custom configuration is used that works for the implemention and the browser. It calls routes and styles.

```tsx in themes folder
// custom Link and Button theme are used as props (linkRouter.tsx)
import { LinkProps } from '@mui/material/Link';
import { Components, Theme } from '@mui/material/styles';
import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router';

const routerLink = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
    const { href, ...other } = props;
    // Map href (Material UI) -> to (react-router)
    return <RouterLink ref={ref} to={href} {...other} />;
});

const routerLinkCustomizations: Components<Theme> = {
    MuiLink: {
        defaultProps: {
            component: routerLink,
        } as LinkProps,
    },
    MuiButtonBase: {
        defaultProps: {
            LinkComponent: routerLink,
        },
    },
};

export default routerLinkCustomizations;

// AppTheme uses linkRouter for global theming (e.g. colorScheme)
export default function AppTheme(props: AppThemeProps) {
    const { children, disableCustomTheme, themeComponents } = props;
    const theme = React.useMemo(() => {
        return disableCustomTheme
            ? {}
            : createTheme({
                  breakpoints: {
                      values: {
                          xs: 500,
                          sm: 800,
                          md: 1024,
                          lg: 1600,
                          xl: 1920,
                      },
                  },
                  // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
                  cssVariables: {
                      colorSchemeSelector: 'data-mui-color-scheme',
                      cssVarPrefix: 'template',
                  },
                  colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
                  typography: {
                      fontFamily: ['Fira Sans', 'sans-serif'].join(','),
                      body1: {
                          fontWeight: '300',
                          lineHeight: 1.3,
                      },
                  },
                  shadows,
                  shape,
                  components: {
                      MuiCssBaseline: {
                          styleOverrides: `
                            @font-face {
                                font-family: 'Fira Sans';
                                font-style: normal;
                                font-display: swap;
                                font-weight: 300;
                              }
                          `,
                      },
                      ...inputsCustomizations,
                      ...dataDisplayCustomizations,
                      ...feedbackCustomizations,
                      ...navigationCustomizations,
                      ...surfacesCustomizations,
                      ...themeComponents,
                      ...routerLinkCustomizations,
                  },
              });
    }, [disableCustomTheme, themeComponents]);
    if (disableCustomTheme) {
        return <React.Fragment>{children}</React.Fragment>;
    }
    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}
```

vitest had issues with the customized MUI Link component RouterLink that was wrapped with forwardRef.

```bash
Error: Not implemented: navigation (except hash changes)
```

To test the MUI Links with ReactRouter Links you need to pass the ReactRouter to the Link Component.

```tsx
// Menu.tsx
<MuiLink
    component={RouterLinkWrapper} // Passing the ReactRouter Link
    href="/"
    sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
    }}
    {...testId('link-home-page')}
>
```

Now the ReactRouter Links are found. Refactoring: Implement the RouterLink once and import as component prop in every Link component and use it in custom themes.

```tsx
// linkRouter import RouterLink (custom theme)
import { LinkProps } from '@mui/material/Link';
import { Components, Theme } from '@mui/material/styles';
import RouterLinkWrapper from '../../components/RouterLink';

const routerLinkCustomizations: Components<Theme> = {
    MuiLink: {
        defaultProps: {
            component: routerLink,
        } as LinkProps,
    },
    MuiButtonBase: {
        defaultProps: {
            LinkComponent: routerLink,
        },
    },
};

export default routerLinkCustomizations;

// footer imprint Link imports RouterLink
<BottomNavigationAction
    component={RouterLinkWrapper}
    href="/impressum"
    label="Impressum"
    style={{ color: 'rgba(33,29,29, 0.5)' }}
    {...testId('link-impressum-page')}
/>;
```

```tsx
// RouterLink.tsx
import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router';

const RouterLinkWrapper = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
    const { href, ...other } = props;
    return <RouterLink ref={ref} to={href} {...other} />;
});

export default RouterLinkWrapper;
```

### Other testing refactors

Mock the window object for vitest since it uses jsdom

```tsx (setupTests.tsx)
beforeAll(() => {
    // other mocks

    Object.defineProperty(window, 'location', {
        writable: true,
        value: {
            ...window.location,
            assign: vi.fn(),
            replace: vi.fn(),
            href: '',
        },
    });
});
```

Optimize vitest.config.ts

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/tests/setupTests.tsx',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', 'dist', '.git'],
        poolOptions: {
            threads: {
                singleThread: true, // Forces single-threaded test runner (no parallelism)
            },
        },
    },
    optimizeDeps: {
        include: ['@mui/system', 'react', 'react-dom'],
        exclude: [
            '@mui/icons-material', // this is likely causing the "too many files" issue
            '@mui/material',
        ],
    },
});
```

Implement data-testId props for MUI custom Text components only in test environment

```ts
// utils testId.ts
export const testId = (id: string) =>
    process.env.NODE_ENV === 'test' ? { 'data-testid': id } : {};
```

```tsx
// index.tsx (offer)
<Section
    textAlign="left"
    background="rgba(255,255,255, 1)"
    color="rgba(33,29,29, 1)"
    padding="0rem 2rem 2rem 4rem"
    data-testid="offer-content-01"
>
    <HeadlineHP
        variant="h4"
        component="h4"
        marginBottom="1rem"
        textAlign="left"
        {...testId('offer-headline-01')}
    >
        {offer[0].attributes.title}
    </HeadlineHP>

    <ParagraphHP {...testId('offer-content-01')}>{parse(sanitizedData0)}</ParagraphHP>
</Section>;

// TextElements.tsx
interface ParagraphHPProps extends PropsWithChildren {
    marginTop?: string;
    marginBottom?: string;
    sx?: SxProps<Theme>;
}

const ParagraphHP = ({
    children,
    marginTop = '0px',
    marginBottom = '1rem',
    sx,
    ...rest
}: ParagraphHPProps) => {
    return (
        <Typography
            component="p"
            sx={{
                fontStyle: 'normal',
                marginTop: marginTop,
                marginBottom: marginBottom,
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Typography>
    );
};

interface HeadlineHPPProps extends PropsWithChildren {
    fontSize?: string;
    marginBottom?: string;
    fontWeight?: 600 | 300;
    textAlign?: 'left' | 'center' | 'right';
    color?: 'rgba(56,255,148, 1)' | 'rgba(33,29,29, 1)' | 'rgba(53,102,64, 1)';
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    sx?: SxProps<Theme>;
}

const HeadlineHP = ({
    children,
    fontSize = '1.3rem',
    marginBottom = '1rem',
    variant = 'h2',
    component = 'h3',
    fontWeight = 600,
    color,
    textAlign = 'center',
    sx,
    ...rest
}: HeadlineHPPProps) => {
    return (
        <Typography
            component={component}
            variant={variant}
            sx={{
                fontWeight: fontWeight,
                fontSize: fontSize,
                fontStyle: 'normal',
                color: color,
                marginBottom: marginBottom,
                textAlign: textAlign,
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Typography>
    );
};
```

## axios and msw

@registering new users with react, laravel 12, sanctum spa.

axios and msw handle response errors differently. This led to an issue when testing state updates dependant on api response.

In the implementation the email validation the email gets validated on the right form before submitting the form and if the email exists after the backend answered with the aai response.

axios api handles response status in range 400 < 500 as errors which you can catch in an try catch block.

This convenience led to breaking the test with msw handlers passing an error: invalid url. This error description makes no sense! Soo it was hard to debug.

The native response.status 422 marking that the user exists in db with an error message. It is wrapped in a error object as new HttpResponse object.

Then again the native the native response object provides the different status as numbers in one response object. Not in new HttpResponse objects that led to the strange message.

Following Frontend Code works fine but automated testing will fail with msw api mocks.

```tsx
// axios.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const LaravelApiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
    withCredentials: true,
});

LaravelApiClient.interceptors.request.use(
    async (config) => {
        const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(
            (config.method ?? '').toLowerCase(),
        );
        if (needsCsrf) {
            await LaravelApiClient.get('/csrf-cookie').then();
            config.headers['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

LaravelApiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                console.warn('Nicht autorisiert – ggf. ausgeloggt');
            }

            if (status === 419) {
                console.warn('CSRF-Token abgelaufen');
            }

            if (status === 422) {
                console.warn('Validierungsfehler:', error.response.data.errors);
            }
        }

        return Promise.reject(error);
    },
);

export default LaravelApiClient;

// components/RegisterForm.tsx
import React, { useState } from 'react';
import LaravelApiClient from '../plugins/axios';

export function RegisterForm() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            // CSRF cookie request
            await LaravelApiClient.get('/csrf-cookie');

            // Registration request
            await LaravelApiClient.post('/auth/spa/register', {
                name: form.name,
                email: form.email,
                password: form.password,
                password_confirmation: form.password_confirmation,
            });

            setSuccess(true);
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError(err.response.data.message || 'User already exists');
                return;
            }

            if (err.response?.status === 419) {
                setError('CSRF token mismatch');
                return;
            }

            setError(err.message || 'Something went wrong');
        }
    };

    return (
        <form onSubmit={handleSubmit} data-testid="form">
            <div>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
            </div>
            <div>
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
            </div>
            <div>
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
            </div>
            <div>
                <input
                    name="password_confirmation"
                    type="password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                />
            </div>

            <button type="submit">Register</button>

            {error && <p role="alert">{error}</p>}
            {success && <p>User successfully registered!</p>}
        </form>
    );
}
```

With the native fetch implementation and the test runs green.

Following Frontend Code works fine for component and automated testing.

```tsx refactor the axios code to native fetch
// components/RegisterForm.tsx
import React, { useState } from 'react';

export function RegisterForm() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            // Step 1: Get CSRF cookie
            await fetch('http://localhost:8000/api/csrf-cookie', {
                credentials: 'include',
            });

            // Step 2: Send register request
            const res = await fetch('http://localhost:8000/api/auth/spa/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': 'mocked-csrf-token', // Must match mock
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    password_confirmation: form.password_confirmation,
                }),
            });

            if (res.status === 409) {
                const data = await res.json();
                setError(data.message || 'User already exists');
                return;
            }

            if (!res.ok) {
                throw new Error('Registration failed');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        }
    };

    return (
        <form onSubmit={handleSubmit} data-testid="form">
            <div>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
            </div>
            <div>
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
            </div>
            <div>
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
            </div>
            <div>
                <input
                    name="password_confirmation"
                    type="password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                />
            </div>

            <button type="submit">Register</button>

            {error && <p role="alert">{error}</p>}
            {success && <p>User successfully registered!</p>}
        </form>
    );
}

// RegisterForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RegisterForm } from '../../components/RegisterForm';
import { db } from '../mocks/db';

const registeredUserData = {
    id: '1',
    name: 'John Doe',
    email: 'existing@example.com',
    password: 'password123',
};

const seedRegisteredUser = db.user.create(registeredUserData);

describe('RegisterForm', () => {
    it('should render a hint if the user already exists', async () => {
        // 🔁 Seed user
        seedRegisteredUser;
        const user = userEvent.setup();
        render(<RegisterForm />);
        const nameInput = screen.getByPlaceholderText(/name/i);
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText('Password');
        const passwordConfirmationInput = screen.getByPlaceholderText('Confirm Password');
        const registerButton = screen.getByRole('button', { name: /register/i });

        await user.clear(nameInput);
        await user.type(nameInput, registeredUserData.name);

        await user.clear(emailInput);
        // await user.type(emailInput, registeredUserData.email);
        await user.type(emailInput, registeredUserData.email); // Use a different email to avoid conflict

        await user.clear(passwordInput);
        await user.type(passwordInput, registeredUserData.password);

        await user.clear(passwordConfirmationInput);
        await user.type(passwordConfirmationInput, registeredUserData.password);

        await user.click(registerButton);

        const error = await screen.findByText(/Die E-Mail Adresse ist bereits vergeben/i);
        expect(error).toBeInTheDocument();
    }, 10_000);
});
```

Keep in mind that backend validation responses for validation can lead to issues with axios.

The same unit test with native fetch and responses but not with axios error resp

## Next issue to fix for testing

The unit test did not clear the form after successful submission of the form data.
Supposedly jsdom did not realize what to do

```tsx did not work in unit test using vitest and rtl
const form = event.currentTarget;
form.reset();
```

Refactor for js controlled form values.

```tsx refactor state based value
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [passwordConfirmation, setPasswordConfirmation] = useState('');

<TextField
    //... same code
    value={name}
    onChange={(e) => setName(e.target.value)}
/>
//...
<TextField
    //... same code
    value={email}
    onChange={(e) => setEmail(e.target.value)}
/>
<TextField
    //... same code
    value={password}
    onChange={(e) => setPassword(e.target.value)}
/>
//...
<TextField
    //... same code
    value={passwordConfirmation}
    onChange={(e) => setPasswordConfirmation(e.target.value)}
/>
```

Refactor blocked validation flow

```tsx
const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    // Run validation here
    const isValid = validateInputs();
    // do not submit if validation fails
    if (!isValid || checked === false) {
        return;
    }

    const form = event.currentTarget;
    const dataFD = new FormData(form);

    // islog : true logs the registered user data right after registration
    const result = await registerUser({
        islog: false,
        name: (dataFD.get('name') as string) ?? '',
        email: (dataFD.get('email') as string) ?? '',
        password: (dataFD.get('password') as string) ?? '',
        password_confirmation: (dataFD.get('passwordConfirmation') as string) ?? '',
        // todo
        // confirmation of terms and condition
    });

    if (result.success) {
        setName('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
        setChecked(false);
    } else {
        setErrors({ email: [result.message] });
    }
};
```

## Github registration with laravel socialite, spa and react

To register with github oauth a user have to visit a url that you can declare while making an oauth app in github.
The user will be redirected to an web interface to login with github. If log in is successful the declared url (callback url) is called by github.
The backend receives via this callback url the user data and saves it as user data.
Also the frontend listens to the callback url to see if the user is registered.

- create oauth app in github
    - create a new project
        - create a authorization callback url <http://localhost:8000/api/auth/github/callback>
        - create credentials for safe backend communication: Client Id and Client Secret
- backend

    - install socialite plugin for github oauth process
    - create config for github Client Id and Client Secret
    - create routes to redirect to github and github callback for processed login
    - create controller with methods to redirect to github login and handle github callback to login or create a user and to redirect to an url accessible by frontend

- frontend
    - create button for github oauth request: <http://localhost:8000/api/auth/github>
    - create a route for github callback: <http://localhost:8000/api/auth/github/callback>
    - create a component that is used on that route. In a try / catch block: It checks if the user is logged in and redirects, otherwise it logs the error and redirects.

### create oauth app in github

github provides a oauth service that can be configured or newly created on github page whe logged in.
<https://github.com/settings/developers>

To create a new one click the 'New OAuth app' Button and follow the instructions.

- Application name
- Homepage URL
- Authorization callback URL

For Single Page Apps with web api oauth you should not 'Enable Device Flow'. This would be of use if you have users that you can manage to be authorized with a CLI Tool or GitCredentialManager. Which we do not use or need.

- application name makes OAuth app distinctable on OAuth app. I used 'laravel, sanctum spa, socialite and mui'
- Homepage URL. <https://www.sokdesign.de/>
- Authorization callback URL <http://localhost:8000/api/auth/github/callback>

When passing the three values a new project gets created.
A Client ID, a client secret will be provided. You should note them immediately because the secret will not be accessible an the second visit of the passage.

### backend

install socialite plugin for github oauth process

```bash
composer require laravel/socialite
```

create config for github Client Id and Client Secret. Be aware that the given GITHUB_REDIRECT_URI contains

- the oauth request: <http://localhost:8000/api/auth/github>
- and the oauth callback: <http://localhost:8000/api/auth/github/callback>

```sh .env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:8000/api/auth/github/callback
```

```php service.php
'github' => [
    'client_id' => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect' => env('GITHUB_REDIRECT_URI'),
],
```

create routes to redirect to github and github callback for processed login

```php
# routes api.php
# oauth request: localhost:8000/api/auth/github
Route::get('/auth/github', [SocialiteController::class, 'redirectToGithub']);
# oauth callback: localhost:8000/api/auth/github/callback
Route::get('/auth/github/callback', [SocialiteController::class, 'handleGithubCallback']);
```

create controller with methods

- to redirect to github login
- and handle github callback
    - to login
    - or create a user
    - and to redirect to an url accessible by frontend ('<http://localhost:5173/auth/callback?logged_in=true>')

```php
<?php

namespace App\Http\Controllers\Api\Auth\Spa;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\RedirectResponse;


class SocialiteController extends Controller
{
    public function redirectToGithub(): RedirectResponse
    {
        return Socialite::driver('github')->stateless()->redirect();
    }

    public function handleGithubCallback()
    {
        $githubUser = Socialite::driver('github')->stateless()->user();

        $user = User::firstOrCreate(
            ['email' => $githubUser->getEmail()],
            [
                'name' => $githubUser->getName() ?? $githubUser->getNickname(),
                'password' => bcrypt(uniqid()), // placeholder
            ]
        );

        Auth::login($user); // session-based login
        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/auth/callback?logged_in=true');
    }
}
```

### frontend

create button for github oauth request: <http://localhost:8000/api/auth/github>

```tsx SignUp.tsx
const handleGithubSignIn = () => {
    window.location.href = `${apiBaseUrl}/auth/github`;
};

<Button
    fullWidth
    variant="outlined"
    onClick={handleGithubSignIn}
    startIcon={<GithubIcon />}
    {...testId('form-button-register-with-github')}
>
    registrieren mit Github
</Button>;
```

create the route created by backend ('<http://localhost:5173/auth/callback>')

It is not the auth/github/callback route.

```tsx routes.tsx
const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        //
    },
    {
        path: '/auth/callback',
        element: <AuthCallback />,
    },
];
```

create a component that is used on that route.
In a try / catch block: It checks if the user is logged in and redirects, otherwise it logs the error and redirects.

```tsx
// AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LaravelApiClient from '../../plugins/axios';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        LaravelApiClient.get('/me')
            .then((res) => {
                console.log('Logged in user:', res.data);
                navigate('/');
            })
            .catch((err) => {
                console.log('Not logged in:', err);
                navigate('/');
            });
    }, []);

    return <p>Logging in...</p>;
};

export default AuthCallback;
```

# Revisit SPA cookie authentication

## Requests

It occured that cookie registration was error prone. Testing with msw showed that there were issues with the url.

env data can be read more robust.

```tsx
const apiBaseUrl = (): string => {
    if (import.meta.env.MODE === 'test' || process.env.NODE_ENV === 'test') {
        return 'http://localhost:8000/api';
    }

    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
};

const serverBaseUrl = (): string => {
    if (import.meta.env.MODE === 'test' || process.env.NODE_ENV === 'test') {
        return 'http://localhost:8000';
    }

    return import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:8000';
};

export default apiBaseUrl;
export { serverBaseUrl };
```

The call to /csrf-cookies was done twice due to react running in strict mode.
But it only had to be run once to set the xsrf cookie.
But in late implemention there was a probability to make new cookie with every LaravelApiClient request.

So we implemented the get cookie once when initializing the App.

```tsx
// App.tsx
import initializeCookie from './plugins/fetchCsrfCookie';

function App() {
    // get cookie once
    useEffect(() => {
        initializeCookie();
    }, []);

    return (
        <Providers>
            <Layout />
        </Providers>
    );
}

export default App;

// fetchCsrfCookie.ts
// single purpose get cookie
import { serverBaseUrl } from '../utils/apiBaseUrl';

let csrfFetched = false;

// Call initialize on app startup or before first protected request
// it is called in App.tsx
async function initializeCookie() {
    if (csrfFetched) return; // skip if already fetched
    csrfFetched = true;

    try {
        await axios.get(`${serverBaseUrl()}/api/csrf-cookie`, {
            // next line sets the xsrf cookie
            withCredentials: true,
        });
    } catch (err) {
        console.error('Failed to fetch CSRF cookie', err);
    }
}

export default initializeCookie;

// axios.ts
// cleaned without getting cookie
// just using cookie withCredentials: true
const LaravelApiClient = axios.create({
    baseURL: apiBaseUrl(),
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
    withCredentials: true,
});

LaravelApiClient.interceptors.request.use(
    (config) => {
        const xsrfToken = Cookies.get('XSRF-TOKEN');
        if (xsrfToken) {
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
        }
        return config;
    },
    (error) => Promise.reject(error),
);
```

Requests are now simpler

```ts
LaravelApiClient.post('/auth/spa/register', form);
```

Whole register request

```ts
const requestRegister = async ({
    shouldFetchUser,
    form,
}: RegisterUserParams): Promise<RegisterResponse> => {
    // laravel expects snake case and naming convention different than in the frontend
    const { passwordConfirmation, ...rest } = form;
    let success = false;

    try {
        await LaravelApiClient.post('/auth/spa/register', {
            ...rest,
            password_confirmation: passwordConfirmation,
        });
        success = true;
        if (shouldFetchUser && success === true) await requestMe(shouldFetchUser);

        return { success: true, message: 'Die Registrierung hat geklappt!' };
    }
    // catch (error: any) {
    //     return setResponseValidationError(error);
    // }
};

export default requestRegister;
```

## Responses

The Responses were a bit chaoticly written, with fetch api and axios api in some overlapping concerns and duplication (just to make safe ;-).

The response object has this structure on success. We do not render response success cases yet.

```ts
{
  success: true,
  message: 'Die Registrierung hat geklappt!'
}
```

We render custom error response objects for form validation.
The response object has this structure on status code that indicate errors.
Laravel responses only an errors object if response status 422 (422 Unprocessable Content).

```ts
{
  success: false,
  message: message || defaultMessage,
  errors,
}: {
  success: false,
  message: string,
  errors?: { [key: string]: string[] }
}

/**
* Example errors:
* {
*   email: ["This email is already taken."],
*   password: ["Password must be at least 8 characters."]
* }
*/
```

This error object is created and returned when an axios error is caught. setResponseValidationError(error)

```tsx
// requestRegister.ts
const requestRegister = async ({
    shouldFetchUser,
    form,
}: RegisterUserParams): Promise<RegisterResponse> => {
    // laravel expects snake case and naming convention different than in the frontend
    // const { passwordConfirmation, ...rest } = form;
    // let success = false;

    try {
        // await LaravelApiClient.post('/auth/spa/register', {
        //     ...rest,
        //     password_confirmation: passwordConfirmation,
        // });
        // success = true;
        // if (shouldFetchUser && success === true) await requestMe(shouldFetchUser);
        // return { success: true, message: 'Die Registrierung hat geklappt!' };
    } catch (error: any) {
        return setResponseValidationError(error);
    }
};

export default requestRegister;

//setResponseValidationError.ts
import { AxiosError } from 'axios';
import { RegisterResponse } from '../../types/entities';

export interface ApiErrorData {
    message?: string;
    errors?: { [key: string]: string[] };
}

export function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError === true;
}

export const setResponseValidationError = (error: unknown): RegisterResponse => {
    if (!isAxiosError(error)) {
        const message =
            error instanceof Error
                ? error.message || 'Ein unerwarteter Fehler ist aufgetreten.'
                : 'Ein unbekannter Fehler ist aufgetreten.';

        return { success: false, message };
    }

    const { response } = error;

    if (!response) {
        return { success: false, message: 'Netzwerkfehler oder Server nicht erreichbar.' };
    }

    const responseData = response.data as ApiErrorData;
    const message = responseData.message ?? '';

    const createResponseErrorValidationObject = (
        message: string,
        defaultMessage: string,
        fieldErrors?: { [key: string]: string[] },
    ): RegisterResponse => {
        return {
            success: false,
            message: message || defaultMessage,
            fieldErrors,
        };
    };

    switch (response.status) {
        case 401:
            return createResponseErrorValidationObject(
                message,
                'Nicht autorisiert - ggf. ausgeloggt.',
            );
        case 419:
            return createResponseErrorValidationObject(
                message,
                `CSRF-Token nicht gültig (Status: ${response.status}).`,
            );
        case 422:
            return createResponseErrorValidationObject(
                message,
                'Validierungsfehler.',
                responseData.errors,
            );
        case 500:
            return createResponseErrorValidationObject(
                message,
                'Interner Serverfehler. Bitte versuchen Sie es später erneut.',
            );
        default:
            return createResponseErrorValidationObject(
                message,
                `Ein Fehler ist aufgetreten (Status: ${response.status}).`,
            );
    }
};
```

The frontend component consumes the response.error for validating input fields like email

```tsx
const result = await requestRegister({
    shouldFetchUser: true,
    form,
});

if (result.success) {
    setForm({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    });
    setFieldErrors({
        name: { hasError: false, message: '' },
        email: { hasError: false, message: '' },
        password: { hasError: false, message: '' },
        passwordConfirmation: { hasError: false, message: '' },
    });
} else {
    const errors = result.fieldErrors || {};
    Object.entries(errors).forEach(([field, messages]) => {
        const key = field as FrontendField;
        setFieldErrors((prev) => ({
            ...prev,
            [key]: {
                hasError: true,
                message: messages[0] ?? 'Ungültiger Wert',
            },
        }));
    });
}
```
