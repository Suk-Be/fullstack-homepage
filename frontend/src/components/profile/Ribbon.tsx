import { Box, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

/**
 *
 * @returns an absolute positioned ribbon layout
 * needs a parent with relative position
 */

interface HeadlineProps extends PropsWithChildren {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const RibbonLayout = ({ variant = 'h2', component = 'h2' }: HeadlineProps) => {
    return (
        <Box
            sx={{
                color: 'rgb(33,29,29)',
                fontFamily: 'Fira Sans',
                fontWeight: 400,
                fontSize: '1rem',
                fontStyle: 'normal',
                background: 'rgb(56,255,148)',
                position: 'absolute',
                inset: '0 calc(-1*2rem) auto auto',
                padding: '20px 20px 30px 2rem',
                clipPath: `polygon(0 0, 100% 0, 100% calc(100% - 10px), 
                                  calc(100% - 2rem) 100%, 
                                  calc(100% - 2rem) calc(100% - 10px), 
                                  0 calc(100% - 10px), 
                                  0px calc(50% - 10px/2))`,
                boxShadow: '0 calc(-1*10px) 0 inset #0005',
                width: 'calc(100% + 2rem)',
            }}
        >
            <Typography
                variant={variant}
                component={component}
                sx={{
                    color: 'rgb(33,29,29)',
                    fontFamily: 'Fira Sans',
                    fontWeight: 600,
                    fontSize: '1.3rem',
                    fontStyle: 'normal',
                    position: 'relative',
                }}
            >
                Das fehlende Puzzlestück
            </Typography>
        </Box>
    );
};
export default RibbonLayout;
