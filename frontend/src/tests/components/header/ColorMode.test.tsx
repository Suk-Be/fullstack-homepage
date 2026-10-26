import { ColorMode } from '@/components/header/ColorMode';
import { useColorScheme } from '@mui/material';
import { CssVarsProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

describe('ColorMode Component', () => {
    const initialCSSThemeLight = 'light';

    const ModeInspector = () => {
        const { mode } = useColorScheme();
        return <div data-testid="current-mode">{mode}</div>;
    };

    it('should render light and dark mode radio buttons and show initial mode', () => {
        render(
            <CssVarsProvider>
                <ColorMode color={initialCSSThemeLight} />
                <ModeInspector />
            </CssVarsProvider>,
        );

        expect(screen.getByText('Theme')).toBeInTheDocument();

        const lightRadio = screen.getByRole('radio', { name: /light/i });
        const darkRadio = screen.getByRole('radio', { name: /dark/i });

        expect(lightRadio).toBeInTheDocument();
        expect(darkRadio).toBeInTheDocument();
    });

    it('should change the color theme state when clicking dark mode or light', async () => {
        const cssThemeDark = 'dark';

        const user = userEvent.setup();

        render(
            <CssVarsProvider>
                <ColorMode color={initialCSSThemeLight} />
                <ModeInspector />
            </CssVarsProvider>,
        );

        const darkRadio = screen.getByRole('radio', { name: /dark/i });
        const lightRadio = screen.getByRole('radio', { name: /light/i });
        const modeDisplay = screen.getByTestId('current-mode');

        // initial state
        expect(lightRadio).toBeChecked();
        expect(darkRadio).not.toBeChecked();

        // action
        await user.click(darkRadio);

        // result
        expect(darkRadio).toBeChecked();
        expect(modeDisplay).toHaveTextContent(cssThemeDark);

        // new state
        expect(lightRadio).not.toBeChecked();
        expect(darkRadio).toBeChecked();

        // action 1
        await user.click(darkRadio);

        expect(darkRadio).toBeChecked();
        expect(modeDisplay).toHaveTextContent(cssThemeDark);

        // action 2
        await user.click(lightRadio);

        expect(darkRadio).not.toBeChecked();
        expect(modeDisplay).toHaveTextContent('light');
    });
});
