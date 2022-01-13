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

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="fixed" sx={{bgcolor: indigo[500]}} data-testid="Navbar">
            <Toolbar disableGutters data-testid="Toolbar_Navbar">
                {/* EXPANDED */}
                <Logo display={displayExpanded} data-testid="navbar-logo-expanded" />
                 <Box sx={{ flexGrow: 1, display: displayExpanded }} data-testid="navbar-menu-expanded" >
                    {pages.map((page, idx) => (
                        <Button
                            key={idx}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                            data-testid={`navbar-expanded-menu-option-${page.label}`}
                        >
                            <a href={page.href} style={{textDecoration: 'inherit', color: 'inherit'}}>{page.label}</a>
                        </Button>
                    ))}
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
                    </Menu>
                </Box>
                <Logo display={displayCollapsed} data-testid="navbar-logo-collapsed" />

        </Toolbar>
                    
    </AppBar>);
};

Navbar.propTypes = {

};

export default Navbar;