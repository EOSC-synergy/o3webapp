import React, { FC } from 'react';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export const LOGO_SOURCE =
    process.env.NEXT_PUBLIC_LOGO_SRC ?? 'https://o3as.data.kit.edu/img/logos/o3as-logo.svg';
export const LOGO_NAVIGATION = '#page-top';
const LOGO_TEXT = 'O3as: Webapp';

type LogoProps = {
    // TODO: Object typing? see https://mui.com/system/display/
    display?: string | object;
};
/**
 * Returns a logo from O3AS and the text "O3AS Webapp".
 *
 * @param display See https://mui.com/system/display/
 */
const Logo: FC<LogoProps> = ({ display }) => {
    return (
        <Link
            href={LOGO_NAVIGATION}
            sx={{
                flexGrow: 1,
                textDecoration: 'inherit',
                color: 'inherit',
                display: display,
            }}
            noWrap
            data-testid="logo-container"
        >
            <Grid container sx={{ alignItems: 'center', margin: '0.5em', marginLeft: '2em' }}>
                <img
                    data-testid="logo-image"
                    style={{ height: '4em', margin: '0.5em' }}
                    src={LOGO_SOURCE}
                    alt="logo"
                />
                <Typography
                    variant="h6"
                    noWrap
                    data-testid="logo-text"
                    sx={{
                        color: '#C7D3E0',
                        '&:hover': {
                            color: '#fed136',
                        },
                        fontSize: '28px',
                    }}
                >
                    {LOGO_TEXT}
                </Typography>
            </Grid>
        </Link>
    );
};

Logo.propTypes = {
    /** Display style to pass to the logo */
    display: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default Logo;
