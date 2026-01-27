import RouterLinkWrapper from '@/components/RouterLink';
import { testId } from '@/utils/testId';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { useState } from 'react';
import { useInRouterContext, useLocation } from 'react-router-dom';

const FooterRoutes = ['/impressum', '/datenschutz'] as const;

function getFooterValue(pathname: string) {
    const idx = FooterRoutes.findIndex((p) => pathname.startsWith(p));
    return idx === -1 ? -1 : idx; // -1 => nichts selected
}

function FooterNav({ value, onChange }: { value: number; onChange?: (newValue: number) => void }) {
    return (
        <footer {...testId('footer')}>
            <Box
                component="nav"
                sx={{
                    width: '100%',
                    height: { xs: '30px', md: '50px' },
                }}
            >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(_, newValue) => onChange?.(newValue)}
                    sx={{
                        height: { xs: '30px', md: '50px' },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'var(--template-palette-nav-bottom-backgroundColor)',
                    }}
                >
                    <BottomNavigationAction
                        component={RouterLinkWrapper}
                        href="/impressum"
                        label="Impressum"
                        style={{ color: 'var(--template-palette-nav-bottom-text)' }}
                        {...testId('link-impressum-page')}
                    />
                    <BottomNavigationAction
                        component={RouterLinkWrapper}
                        href="/datenschutz"
                        label="Datenschutz"
                        style={{ color: 'var(--template-palette-nav-bottom-text)' }}
                        {...testId('link-datenschutz-page')}
                    />
                </BottomNavigation>
            </Box>
        </footer>
    );
}

const Footer = () => {
    const inRouter = useInRouterContext(); // boolean true es existiert ein router

    // ✅ Tests / Storybook / isolated render: kein Router → alter State-Modus
    if (!inRouter) {
        const [value, setValue] = useState(0);
        return <FooterNav value={value} onChange={setValue} />;
    }

    // ✅ App: Router ist da → Route ist Source of Truth
    const { pathname } = useLocation();
    const value = getFooterValue(pathname);
    return <FooterNav value={value} />;
};

export default Footer;
