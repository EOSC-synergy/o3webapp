import * as React from 'react';
import { Box } from '@mui/system';
import { Grid, Link } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

/**
 * A container for important links
 * at the bottom of the Website.
 * Contains links to the impressum, 
 * privacy policy and the terms of service
 */
function Footer (props) {
    let theme = useTheme();
    return (
        <Grid
                spacing={1}
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{backgroundColor: theme.palette.grey[200], paddingBottom: "0.5em", alignText:"center"}}
            >
                <Grid item xs={3} style={{alignText:"center"}}>
                    <Link>Impressum</Link>
                </Grid>
                <Grid item xs={3} style={{alignText:"center"}}>
                    <Link>Privacy Policy</Link>
                </Grid>
                <Grid item xs={3} style={{alignText:"center"}}>
                    <Link>Terms of Service</Link>
                </Grid>
            </Grid>
    );
}

export default Footer;