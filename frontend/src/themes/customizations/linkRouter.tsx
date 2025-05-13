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
