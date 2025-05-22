import { LinkProps } from '@mui/material/Link';
import { Components, Theme } from '@mui/material/styles';
import RouterLinkWrapper from '../../components/RouterLink';

const routerLinkCustomizations: Components<Theme> = {
    MuiLink: {
        defaultProps: {
            component: RouterLinkWrapper,
        } as LinkProps,
    },
    MuiButtonBase: {
        defaultProps: {
            LinkComponent: RouterLinkWrapper,
        },
    },
};

export default routerLinkCustomizations;
