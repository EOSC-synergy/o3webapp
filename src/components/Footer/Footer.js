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
                width: '100vw'
            }}
        >

            <Grid
                spacing={3}
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                data-testid="footer-grid-container"
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    backgroundColor: theme.palette.grey[200],
                    textAlign: 'center',
                    paddingTop: '1.5em',
                    paddingBottom: '1.5em',
                    marginRight: 0
                }}>
                {links.map((x, idx) => {
                    return (
                        <Grid
                            item
                            sm={12 / links.length}
                            style={{alignText:"center"}} key={idx}
                            data-testid={`footer-grid-item-${links.label}`}
                        >
                            <Link href={x.href} data-testid={`footer-link-${links.label}`}>
                                <Typography>{x.label}</Typography>
                            </Link>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
}

export default Footer;