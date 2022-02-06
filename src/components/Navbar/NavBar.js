import * as React from 'react';
import {AppBar, Box, Button, Container, Grid, Toolbar} from '@mui/material';
import { indigo } from '@mui/material/colors';
import Logo from './Logo/Logo';
import { AiFillEdit } from 'react-icons/ai';
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
            <AppBar position="static" sx={{ margin: 0, bgcolor: indigo[500] }} data-testid="Navbar" >
                <Container disableGutters maxWidth={false} sx={{ margin: 0 }} >
                    <Toolbar disableGutters data-testid="Toolbar_Navbar">
                        <Grid
                            container
                        >
                            <Grid
                                item
                            >
                                <Logo display='flex' data-testid="navbar-logo-expanded" />
                            </Grid>
                            <Grid
                                item
                            >
                                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                                    <Button
                                        key={"editGraphButton"}
                                        onClick={props.openSidebar}
                                        sx={{ my: 2, color: 'white', display: 'block'}}
                                    ><AiFillEdit size={20} /><Typography>Edit Graph</Typography>
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

Navbar.propTypes = {

};

export default Navbar;