import React from 'react';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

/**
 * The link that provides the image logo
 */
const logoSrc = "https://o3as.data.kit.edu/img/logos/o3as-logo.svg";
/**
 * The link to the O3AS Webapp
 */
const O3ASLink = "#";

/**
 * Returns a logo from O3AS and the text "O3AS Webapp"
 * @param {Object} props 
 * @param {Object} props.display when the logo should be displayed
 * @returns {JSX.Element} containing one Image and one Text wrapped in a Link component
 */
const Logo = (props) => {
    return (
        <Link
            href={O3ASLink}
            sx={{ flexGrow: 1, textDecoration: 'inherit', color: 'inherit', display: props.display, minWidth: "70%" }}
            noWrap
        >   
            <Grid container sx={{ alignItems: "center", margin: '0.5em', marginLeft: '2em'}}>
                <img style={{height: '5em', margin: '0.5em'}} src={logoSrc} />
                <Typography variant="h6" noWrap>
                    O3AS Webapp
                </Typography>
            </Grid>
        </Link>
    );
};

Logo.propTypes = {
    display: PropTypes.object
}

export default Logo;