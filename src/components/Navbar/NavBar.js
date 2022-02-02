import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import { indigo } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Logo from './Logo/Logo';
import Container from '@mui/material/Container';
import { AiFillEdit } from 'react-icons/ai';
import Typography from "@mui/material/Typography";

/**
 * The pages and corresponding links that should be visible in the menu
 */
export const pages = [
    {
        label: "About O3AS",
        href: "https://o3as.data.kit.edu/"
    },
    {
        label: "API",
        href: "https://api.o3as.fedcloud.eu/api/v1/ui/"
    },
    {
        label: "Legal",
        href: "#"
    }
];

const displayCollapsed = { xs: 'flex', md: 'none' };
const displayExpanded = { xs: 'none', md: 'flex' }


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
        // <Box sx={{ flexGrow: 1, width:"100vw" }}>
            <AppBar position="static" sx={{ margin: 0, bgcolor: indigo[500] }} data-testid="Navbar" >
                <Container disableGutters maxWidth={false} sx={{ margin: 0 }} >
                    <Toolbar disableGutters data-testid="Toolbar_Navbar" >
                        {/* EXPANDED */}
                        <Logo display={displayExpanded} data-testid="navbar-logo-expanded" />
                        <Box sx={{ flexGrow: 1, display: displayExpanded }} data-testid="navbar-menu-expanded" >
                            {pages.map((page, idx) => (
                                <Button
                                    key={idx}
                                    sx={{ my: 2, color: 'white', display: 'block'}}
                                    data-testid={`navbar-expanded-menu-option-${page.label}`}
                                >
                                    <a href={page.href} style={{textDecoration: 'inherit', color: 'inherit'}}>{page.label}</a>
                                </Button>
                            ))}
                        </Box>
                        <Box sx={{ flexGrow: 1, display: displayExpanded }}>
                            <Button
                                key={"editGraphButton"}
                                onClick={props.openSidebar}
                                sx={{ my: 2, color: 'white', display: 'block'}}
                            ><AiFillEdit size={20} /><Typography>Edit Graph</Typography>
                            </Button>
                        </Box>

                        {/* COLLAPSED */}
                        <Box sx={{ flexGrow: 1, display: displayCollapsed }}>
                            <IconButton
                                size="large"
                                aria-label="menu"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                                data-testid="navbar-menu-collapsed"
                            >
                            {pages.map((page, idx) => (
                                <MenuItem
                                    key={idx}
                                    sx={{ my: 2, display: 'block' }}
                                    data-testid={`navbar-collapsed-menu-option-${page.label}`}
                                >
                                    <a href={page.href} style={{textDecoration: 'inherit', color: 'inherit'}}>{page.label}</a>
                                </MenuItem>
                            ))}
                                <MenuItem
                                    key={"editGraphButton"}
                                    sx={{ my: 2, display: 'block' }}
                                >
                                    <Button
                                        onClick={handleEditGraphButtonCollapsed}
                                        sx={{ textDecoration: 'inherit', color: 'inherit', bgcolor: 'transparent'}}
                                    ><AiFillEdit size={20} style={{marginRight: '0.5em'}} /><Typography>Edit Graph</Typography>
                                    </Button>
                                </MenuItem>
                            </Menu>
                        </Box>
                        <Logo display={displayCollapsed} data-testid="navbar-logo-collapsed" />

                </Toolbar>
            </Container>
        </AppBar>
    // </Box>
    );
};

Navbar.propTypes = {

};

export default Navbar;