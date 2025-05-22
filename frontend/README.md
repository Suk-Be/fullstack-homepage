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
