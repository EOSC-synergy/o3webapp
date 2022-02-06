import React from 'react';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

/**
 * The link that provides the image logo
 */
export const logoSrc = "https://o3as.data.kit.edu/img/logos/o3as-logo.svg";
/**
 * The link to the O3AS Webapp
 */
export const O3ASLink = "#page-top";

/**
 * Returns a logo from O3AS and the text "O3AS Webapp"
 * @param {Object} props 
 * @param {Object|String} props.display when the logo should be displayed
 * @returns {JSX.Element} containing one Image and one Text wrapped in a Link component
 */
const Logo = (props) => {
    return (
        <Link
            href={O3ASLink}
            sx={{ flexGrow: 1, textDecoration: 'inherit', color: 'inherit', display: props.display}}
            noWrap
            data-testid="logo-container"
        >   
            <Grid container sx={{ alignItems: "center", margin: '0.5em', marginLeft: '2em'}}>
                <img data-testid="logo-image" style={{height: '5em', margin: '0.5em'}} src={logoSrc} alt={"logo"} />
                <Typography variant="h6" noWrap data-testid="logo-text">
                    O3as: Webapp
                </Typography>
            </Grid>
        </Link>
    );
};

Logo.propTypes = {
    display: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ])
}

export default Logo;