import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Grid, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const links = [
    {
        label: "Terms of Use",
        href: "https://o3as.data.kit.edu/policies/terms-of-use.html"
    },
    {
        label: "Privacy Policy",
        href: "https://o3as.data.kit.edu/policies/privacy-policy.html"
    },
    {
        label: "How to Acknowledge",
        href: "https://o3as.data.kit.edu/policies/how-to-acknowledge.html"
    }
]

/**
 * A container for important links
 * at the bottom of the Website.
 * Contains links to the impressum, 
 * privacy policy and the terms of service
 */
function Footer (props) {
    let theme = useTheme();
    return (
        <div 
            style={{
                position: 'absolute',
                bottom: 0,
                width: '100vw',
                backgroundColor: theme.palette.grey[200],
                textAlign: 'center',
                paddingTop: '1.5em',
                paddingBottom: '1.5em'
        }}>
            <Grid
                spacing={3}
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                {links.map((x, idx) => {
                return (
                    <Grid item sm={12 / links.length} style={{alignText:"center"}} key={idx}>
                        <Link href={x.href}><Typography>{x.label}</Typography></Link>
                    </Grid>
                );
                })}
            </Grid>
        </div>
    );
}

export default Footer;