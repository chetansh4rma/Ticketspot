import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Tooltip,
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
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileClick = () => {
    navigate('/profile');
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
                  <Typography sx={{ ml: 1, display: { md: 'block' } }}>{page.label}</Typography>
                </Button>
              ))}

              <Box sx={{ flexGrow: 0, ml: 2 }}>
                <Tooltip title="Go to Profile">
                  <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                    <AccountCircleIcon sx={{ color: 'var(--secondary-color)', fontSize: 40 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
