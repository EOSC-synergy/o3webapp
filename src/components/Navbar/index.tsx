import React, { FC } from 'react';
import { AppBar, Button, Container, Grid, Toolbar } from '@mui/material';
import Logo from './Logo';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import { BACKGROUND_BASE_COLOR } from 'utils/constants';

type NavBarProps = {
    openSidebar?: () => void;
};
/** A component for the navigation of the website. */
const NavBar: FC<NavBarProps> = ({ openSidebar = () => undefined }) => {
    return (
        <div id="NavBar" style={{ flex: '0 1 auto' }}>
            <AppBar
                position="static"
                sx={{ margin: 0, bgcolor: BACKGROUND_BASE_COLOR }}
                data-testid="NavBar"
            >
                <Container disableGutters maxWidth={false} sx={{ margin: 0 }}>
                    <Toolbar disableGutters data-testid="Toolbar_Navbar">
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            key="navbar grid container"
                            sx={{ backgroundColor: BACKGROUND_BASE_COLOR }}
                        >
                            <Grid item xs={8} key="logo grid item">
                                <Logo display="flex" data-testid="navbar-logo-expanded" />
                            </Grid>
                            <Grid item key="edit graph button grid item">
                                <Button
                                    key={'editGraphButton'}
                                    onClick={openSidebar}
                                    sx={{
                                        color: 'white',
                                        '&:hover': {
                                            color: '#fed136',
                                        },
                                    }}
                                >
                                    <Typography>
                                        Edit Graph <EditIcon sx={{ fontSize: '14px' }} />
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
};

export default NavBar;
