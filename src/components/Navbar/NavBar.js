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


const pages = [
    {
        label: "API",
        href: "https://api.o3as.fedcloud.eu/api/v1/ui/"
    },
    {
        label: "About O3AS",
        href: "https://o3as.data.kit.edu/"
    },
    {
        label: "Legal",
        href: "#"
    }
];

const LogoCollapsedNavbar = () => {
    return(<>
        <Link
            href="#"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            component="div"
            noWrap
        >
            <img style={{height: '5em', margin: '0.5em'}} src="https://o3as.data.kit.edu/img/logos/o3as-logo.svg" />
        </Link>
        <Link
            href="#"
            underline="none"
            variant="h6"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, textDecoration: 'inherit', color: 'inherit'  }}
        >
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
                O3AS Webapp
            </Typography>
        </Link>
    </>);
}

const LogoExpandedNavbar  = () => {
    return(<>
        <Link
            href="#"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            component="div"
            noWrap
        >
            <img style={{height: '5em', margin: '0.5em'}} src="https://o3as.data.kit.edu/img/logos/o3as-logo.svg" />
        </Link>
        <Link
            href="#"
            underline="none"
            variant="h6"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, textDecoration: 'inherit', color: 'inherit' }}
        >
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
                O3AS Webapp
            </Typography>
        </Link>
    </>);
}



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
                <LogoExpandedNavbar />
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
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
                <LogoCollapsedNavbar />
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                    <Button
                        key={page}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        <a href={page.href} style={{textDecoration: 'inherit', color: 'inherit'}}>{page.label}</a>
                    </Button>
                    ))}
                </Box>

        </Toolbar>
                    
        </AppBar>
    );
}

export default Navbar;