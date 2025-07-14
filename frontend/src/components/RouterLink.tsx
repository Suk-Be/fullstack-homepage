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

interface RouterLinkWrapperProps extends Omit<RouterLinkProps, 'to'> {
  href: RouterLinkProps['to'];
}

const RouterLinkWrapper = React.forwardRef<
    HTMLAnchorElement,
    RouterLinkWrapperProps
>((props, ref) => {
    const { href, ...other } = props;
    return <RouterLink ref={ref} to={href} {...other} />;
});

RouterLinkWrapper.displayName = 'RouterLinkWrapper';

export default RouterLinkWrapper;
