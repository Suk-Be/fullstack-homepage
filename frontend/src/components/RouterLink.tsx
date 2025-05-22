// routerLink.tsx
import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router';

/**
 * RouterLinkWrapper
 * 
 * is needed for automated testing
 * since vitest has issues with (probably) hoisting the RouterLink must be passed in a top level component
 * 
 * @usage for MUI Link and Button 
 * component={RouterLinkWrapper}
 * 
 * @example 
 * import { Link as MuiLink } from '@mui/material';
 * <MuiLink 
 *    component={RouterLinkWrapper}
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
      {children}
  </MuiLink>
 */

const RouterLinkWrapper = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
    const { href, ...other } = props;
    return <RouterLink ref={ref} to={href} {...other} />;
});

export default RouterLinkWrapper;
