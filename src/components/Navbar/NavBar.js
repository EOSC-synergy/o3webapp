import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { styled, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import { indigo } from '@mui/material/colors';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Logo from './Logo/Logo';

const pages = [
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

    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="fixed" sx={{bgcolor: indigo[500]}}>
            <Toolbar disableGutters>
                {/* EXPANDED */}
                {/* Logo for expanded Navbar */}
                <Logo display={displayExpanded} />
                 {/* Menu for expanded Navbar */}
                 <Box sx={{ flexGrow: 1, display: displayExpanded }}>
                    {pages.map((page, idx) => (
                    <Button
                        key={idx}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        <a href={page.href} style={{textDecoration: 'inherit', color: 'inherit'}}>{page.label}</a>
                    </Button>
                    ))}
                </Box>

                {/* COLLAPSED */}
                {/* Menu for collapsed Navbar */}
                <Box sx={{ flexGrow: 1, display: displayCollapsed }}>
                    <IconButton
                        size="large"
                        aria-label="Menu"
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
                    >
                    {pages.map((page, idx) => (
                        <MenuItem
                            key={idx}
                            sx={{ my: 2, display: 'block' }}
                        >
                            <a href={page.href} style={{textDecoration: 'inherit', color: 'inherit'}}>{page.label}</a>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>
                {/* Logo for collapsed Navbar */}
                <Logo display={displayCollapsed} />

        </Toolbar>
                    
    </AppBar>);
}

export default Navbar;