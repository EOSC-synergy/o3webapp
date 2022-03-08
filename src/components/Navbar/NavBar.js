import * as React from 'react';
import {AppBar, Button, Container, Grid, Toolbar} from '@mui/material';
import Logo from './Logo/Logo';
import EditIcon from '@mui/icons-material/Edit';
import Typography from "@mui/material/Typography";

/**
 * A component for the navigation of the website.
 */
function Navbar(props) {

    /**
     * whether the menu (when the navbar collapsed) is currently visible
     */
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    /**
     * Opens the nav menu.
     *
     * @param event the event that triggered this function
     */
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    /**
     * Closes the nav menu.
     */
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    /**
     * When the edit graph button is clicked in collapsed mode,
     * the nav menu will close first before the sidebar will open.
     */
    const handleEditGraphButtonCollapsed = () => {
        handleCloseNavMenu();
        props.openSidebar();
    }

    return (
        <div id="Navbar">
            <AppBar position="static" sx={{ margin: 0, bgcolor: '#111'}} data-testid="Navbar" >
                <Container disableGutters maxWidth={false} sx={{ margin: 0 }} >
                    <Toolbar disableGutters data-testid="Toolbar_Navbar">
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            key="navbar grid container"
                        >
                            <Grid
                                item
                                xs={8}
                                key="logo grid item"
                            >
                                <Logo display='flex' data-testid="navbar-logo-expanded" />
                            </Grid>
                            <Grid
                                item
                                key="edit graph button grid item"
                            >
                                <Button
                                     key={"editGraphButton"}
                                     onClick={props.openSidebar}
                                     sx={{
                                         color: 'white',
                                        '&:hover': {
                                             color: '#fed136',
                                        },
                                     }}
                                >
                                    <Typography>Edit Graph <EditIcon sx={{fontSize: '14px'}} /></Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
}

Navbar.propTypes = {

};

export default Navbar;