import React from 'react';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const Logo = (props) => {
    if (!('display' in props)) {
        return (<></>)
    }
    return ( <>
        <Link
            href="#"
            sx={{ flexGrow: 1, textDecoration: 'inherit', color: 'inherit', display: props.display, minWidth: "70%" }}
            noWrap
        >   
            <Grid container sx={{ alignItems: "center", margin: '0.5em', marginLeft: '2em'}}>
                <img style={{height: '5em', margin: '0.5em'}} src="https://o3as.data.kit.edu/img/logos/o3as-logo.svg" />
                <Typography variant="h6" noWrap>
                    O3AS Webapp
                </Typography>
            </Grid>
        </Link>
    </>);
};

Logo.propTypes = {
    display: PropTypes.object.isRequired
}

export default Logo;