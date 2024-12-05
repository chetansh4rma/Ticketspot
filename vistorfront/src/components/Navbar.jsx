import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import Logo from './assets/logo.jpg';
import { Menu as MenuIcon, Close, AccountCircle } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/navbar.css'; // Updated CSS file

const navigations = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Explore', path: '/explore' },
];

const Navbar = () => {
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(anchorEl);
  const theme = useTheme();
  const matchMobileView = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation(); // Use location hook
  const menuRef = useRef();

  // Sticky header functionality
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => setVisibleMenu(!visibleMenu);

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Remove the 'token' cookie by setting its expiration to a past date
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Navigate to the login page after logout
    navigate('/login');
  };

  return (
    <header className={`header ${isSticky ? 'sticky__header' : ''}`}>
      <Box
        className="nav__wrapper"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem',
          height: '80px',
          backgroundColor: 'background.paper',
        }}
      >
        {/* Logo */}
        <div className="logo" onClick={() => navigate('/')}>
          <img
            src={Logo}
            alt="Logo"
            className="logo-img"
          />
        </div>

        {/* Navigation Links */}
        <nav
          ref={menuRef}
          className={`navigation ${visibleMenu ? 'show__menu' : ''}`}
        >
          <ul className="menu d-flex align-items-center gap-5">
            {navigations.map((nav, index) => (
              <li className="nav__item" key={index}>
                <Link
                  href={nav.path}
                  className={`nav__item a ${location.pathname === nav.path ? 'active__link' : ''}`} // Check if path matches
                >
                  {nav.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profile and Mobile Menu */}
        <div className="nav__right d-flex align-items-center gap-4">
          {/* Profile Menu */}
          <div className="profile-menu">
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleProfileMenuClick}
            >
              <AccountCircle sx={{ color: '#000000' }} fontSize="large" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={isProfileMenuOpen}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <Link href="/myticket" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  My Tickets
                </Link>
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <Link href="/my-profile" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  My Profile
                </Link>
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <Link href="/settings" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  Settings
                </Link>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </div>

          {/* Mobile Menu Toggle */}
          {matchMobileView && (
            <span className="mobile__menu" onClick={toggleMenu}>
              {visibleMenu ? (
                <Close sx={{ color: '#faa935' }} />
              ) : (
                <MenuIcon sx={{ color: '#faa935' }} />
              )}
            </span>
          )}
        </div>
      </Box>

      {/* Mobile Menu Content */}
      {visibleMenu && matchMobileView && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            backgroundColor: 'background.paper',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 1300,
            py: 2,
          }}
        >
          <nav>
            <ul className="menu d-flex flex-column align-items-start">
              {navigations.map((nav, index) => (
                <li className="nav__item" key={index}>
                  <Link
                    href={nav.path}
                    className={`nav__item a ${location.pathname === nav.path ? 'active__link' : ''}`} // Check if path matches
                    onClick={() => setVisibleMenu(false)} // Close menu after clicking
                  >
                    {nav.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Box>
      )}
    </header>
  );
};

export default Navbar;
