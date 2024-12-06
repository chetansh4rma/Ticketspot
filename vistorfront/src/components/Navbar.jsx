import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ExploreIcon from '@mui/icons-material/Explore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Logo from './assets/LogoTicketspott.png';
import './css/navbar.css';

const pages = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'About', path: '/about', icon: <InfoIcon /> },
  { label: 'Explore', path: '/explore', icon: <ExploreIcon /> },
];

const settings = ['My Tickets', 'My Profile', 'Settings', 'Logout'];

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/login');
  };

  return (
    <HideOnScroll>
      <AppBar position="static" className="header" sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters className="nav__wrapper">
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'var(--heading-color)',
              }}
            >
              <img src={Logo} alt="Logo" className="logo-img" />
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {pages.map((page) => (
                <Button
                  key={page.label}
                  component={Link}
                  to={page.path}
                  className={`nav__item ${location.pathname === page.path ? 'active__link' : ''}`}
                  sx={{
                    my: 2,
                    color: 'var(--heading-color)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {page.icon}
                  <Typography sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>{page.label}</Typography>
                </Button>
              ))}

              <Box sx={{ flexGrow: 0, ml: 2 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <AccountCircleIcon sx={{ color: 'var(--secondary-color)', fontSize: 40 }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;

