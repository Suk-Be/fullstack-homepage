import { FacebookIcon, GoogleIcon, SitemarkIcon } from '@/components/icons/CustomIcons'; // Pfad anpassen
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('CustomIcons', () => {
    it.each([
        {
            icon: <SitemarkIcon />,
            name: 'SitemarkIcon',
            testId: 'sitemark-icon',
        },
        {
            icon: <FacebookIcon />,
            name: 'FacebookIcon',
            testId: 'facebook-icon',
        },
        {
            icon: <GoogleIcon />,
            name: 'GoogleIcon',
            testId: 'google-icon',
        },
    ])('renders $name without crashing', ({ icon, testId }) => {
        render(icon);
        // Prüfen, ob ein SVG gerendert wurde
        const svgElement = screen.getByTestId(testId);
        expect(svgElement).toBeInTheDocument();
    });
});
