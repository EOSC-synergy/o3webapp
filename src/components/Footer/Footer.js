import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Grid, Link } from '@mui/material';
import { BACKGROUND_BASE_COLOR } from '../../utils/constants';

/**
 * The links on the right-hand side in the footer with label and href.
 *
 * @type {Array.<{label: string, href: string}>}
 * @constant
 * @memberof Footer
 */
export const links = [
    {
        label: "O3as",
        href: "https://o3as.data.kit.edu/#page-top"
    },
    {
        label: "Privacy Policy",
        href: "https://o3as.data.kit.edu/policies/privacy-policy.html"
    },
    {
        label: "Terms of Use",
        href: "https://o3as.data.kit.edu/policies/terms-of-use.html"
    },
    {
        label: "Gitlab",
        href: "https://git.scc.kit.edu/synergy.o3as/o3webapp"
    },
    {
        label: "How to Acknowledge",
        href: "https://o3as.data.kit.edu/policies/how-to-acknowledge.html"
    }
]

/**
 * A container for copyright text and important links at the bottom of the Website.
 * Contains links to home page, privacy policy, terms of use and how to acknowledge
 * @component
 */
const Footer = (props) => {

    return (
        <div
            style={{
                width: '100%'
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
                    position: 'relative',
                    backgroundColor: BACKGROUND_BASE_COLOR,
                    textAlign: 'center',
                    marginTop: '10px',
                    paddingTop: '3px',
                    paddingBottom: '20px',
                }}>
                <Grid
                    item
                    container
                    justifyContent="center"
                    md={6}
                    sm={12}
                    key="Copyright text KIT - outer grid"
                >
                    <Grid
                        item
                        md={6}
                        sm={12}
                        sx={{
                            textAlign:"center",
                        }}
                        key="Copyright text KIT - inner grid"
                    >
                    <span style={{color: '#fed136'}}>
                        <Typography
                            sx={{
                                fontSize: 14,
                                lineHeight: 3
                            }}
                        >
                            Copyright © KIT – The&nbsp;
                            <Link
                                href={"https://www.kit.edu/kit/english/research-university.php"}
                                data-testid={`footer-link-research-university}`}
                                sx={{
                                    color: '#fed136',
                                    textDecoration: 'none',
                                }}
                                underline='hover'
                            >
                                Research University
                            </Link>
                            &nbsp;in the Helmholtz Association
                        </Typography>
                    </span>
                    </Grid>
                </Grid>
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="center"
                    md={6}
                    sm={12}
                    sx={{
                        textAlign:"center",
                    }}
                    key="links"
                >
                    {links.map((x, idx) => {
                        return (
                            <Grid
                                item
                                md={"auto"}
                                key={idx}
                                sx={{
                                    mx: 1
                                }}
                                data-testid={`footer-grid-item`}
                            >
                                <Link
                                    href={x.href}
                                    data-testid={`footer-link-${links.label}`}
                                    sx={{
                                        color: '#fed136',
                                        textDecoration: 'none',
                                    }}
                                    underline='hover'
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            lineHeight: 3
                                        }}
                                    >
                                        {x.label}
                                    </Typography>
                                </Link>
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        </div>
    );
}

export default Footer;