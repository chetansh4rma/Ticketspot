import React, { useState } from 'react';
import {
  Box,
  Container,
  IconButton,
  Link,
  Typography,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import Logo from './assets/logo.jpg';
import { Menu as MenuIcon, Close, AccountCircle } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './css/home.css';

const navigations = [
  { label: 'Home', path: '/' },
  { label: 'Explore', path: '/explore' },
];

const Navigation = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      // Navigate to search page with the search query in the URL
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      <div className="search-bar-container" style={{ width: '65%' }}>
        <input
          type="text"
          placeholder="Search monuments, locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
          className="search-input"
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
        {navigations.map((nav) => (
          <Link href={nav.path} key={nav.label} style={{marginBottom: "2vw"}} sx={{ textDecoration: 'none' }}>
            <Typography variant="body1" color="text.primary">
              {nav.label}
            </Typography>
          </Link>
        ))}
      </Box>
    </>
  );
};

const Navbar = () => {
  const [visibleMenu, setVisibleMenu] = useState(false);
  const theme = useTheme();
  const matchMobileView = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(anchorEl);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Remove the 'token' cookie by setting its expiration to a past date
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Optionally, navigate to the login page or home page after logout
    navigate('/login');
  };

  return (
    <Box sx={{ backgroundColor: 'background.paper' }}>
      <Container sx={{ py: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" color="primary">
            <img src={Logo} alt="Logo" className="mx-auto w-29 h-20 sm:w-29 sm:h-24" />
          </Typography>
          <Box sx={{ ml: 'auto', display: { xs: 'inline-flex', md: 'none' } }}>
            <IconButton onClick={() => setVisibleMenu(!visibleMenu)}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', md: 'row' },
              transition: (theme) => theme.transitions.create(['top']),
              ...(matchMobileView && {
                py: 6,
                backgroundColor: 'background.paper',
                zIndex: 'appBar',
                position: 'fixed',
                height: { xs: '100vh', md: 'auto' },
                top: visibleMenu ? 0 : '-120vh',
                left: 0,
              }),
            }}
          >
            <Box />
            <Navigation />

            <Box sx={{ display: 'flex', alignItems: 'center',marginBottom: "1.8vw"}}>
              <IconButton
                onClick={handleProfileMenuClick}
                size="large"
                edge="end"
                color="inherit"
              >
                <AccountCircle fontSize="large" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={isProfileMenuOpen}
                onClose={handleProfileMenuClose}
                sx={{ mt: '45px' }}
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
            </Box>

            {visibleMenu && matchMobileView && (
              <IconButton
                sx={{
                  position: 'fixed',
                  top: 10,
                  right: 10,
                }}
                onClick={() => setVisibleMenu(!visibleMenu)}
              >
                <Close />
              </IconButton>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Navbar;
