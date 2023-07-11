import React, { FC } from 'react';
import Typography from '@mui/material/Typography';
import { Grid, Link } from '@mui/material';
import { BACKGROUND_BASE_COLOR } from 'utils/constants';

const DEFAULT_LINKS = [
    { label: 'O3as', href: 'https://o3as.data.kit.edu/' },
    { label: 'Privacy Policy', href: 'https://o3as.data.kit.edu/policies/privacy-policy.html' },
    { label: 'Terms of Use', href: 'https://o3as.data.kit.edu/policies/terms-of-use.html' },
    { label: 'Gitlab', href: 'https://git.scc.kit.edu/synergy.o3as/o3webapp' },
    {
        label: 'How to Acknowledge',
        href: 'https://o3as.data.kit.edu/policies/how-to-acknowledge.html',
    },
];

export const FOOTER_LINKS: {
    label: string;
    href: string;
}[] =
    process.env.NEXT_PUBLIC_FOOTER_LINKS !== undefined
        ? JSON.parse(process.env.NEXT_PUBLIC_FOOTER_LINKS)
        : DEFAULT_LINKS;

const Footer: FC = () => {
    return (
        <Grid
            container
            sx={{
                direction: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                backgroundColor: BACKGROUND_BASE_COLOR,
                textAlign: 'center',
                paddingTop: '.5rem',
                paddingBottom: '.5rem',
            }}
        >
            <Grid item justifyContent="center" md={6} sm={12}>
                <Typography
                    sx={{
                        fontSize: 14,
                        lineHeight: 3,
                        color: '#fed136',
                    }}
                >
                    Copyright © KIT – The&nbsp;
                    <Link
                        href="https://www.kit.edu/kit/english/research-university.php"
                        underline="hover"
                    >
                        Research University
                    </Link>
                    &nbsp;in the Helmholtz Association
                </Typography>
            </Grid>
            <Grid
                item
                container
                direction="row"
                justifyContent="center"
                md={6}
                sm={12}
                sx={{
                    textAlign: 'center',
                }}
            >
                {FOOTER_LINKS.map((link) => (
                    <Grid
                        item
                        md="auto"
                        key={link.href}
                        sx={{
                            mx: 1,
                        }}
                    >
                        <Link
                            href={link.href}
                            sx={{
                                color: '#fed136',
                                textDecoration: 'none',
                            }}
                            underline="hover"
                        >
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    lineHeight: 3,
                                }}
                            >
                                {link.label}
                            </Typography>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

export default Footer;
