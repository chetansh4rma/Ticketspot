import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ExploreIcon from '@mui/icons-material/Explore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import Logo from './assets/LogoTicketspott.png';
import './css/navbar.css';

const pages = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'About', path: '/about', icon: <InfoIcon /> },
  { label: 'Explore', path: '/explore', icon: <ExploreIcon /> },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAutocomplete = async () => {
      if (searchQuery.trim().length === 0) {
        setAutocompleteResults([]);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/auth/search-monuments/${searchQuery}`);
        setAutocompleteResults(response.data.monuments || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching autocomplete results:', error);
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => fetchAutocomplete(), 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAutocompleteSelect = (monument) => {
    navigate(`/search?search=${encodeURIComponent(monument.MonumentName)}`);
    setSearchQuery('');
    setAutocompleteResults([]);
  };
  

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/museums?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={Logo} alt="Logo" className="logo-img" />
        </Link>

        <form onSubmit={handleSearchSubmit} className="navbar-search">
          <div className="navbar-search-container">
            <input
              type="text"
              placeholder="Search museums..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="navbar-search-input"
            />
            {loading && <div className="loading-indicator">Loading...</div>}
            {autocompleteResults.length > 0 && (
              <ul className="navbar-autocomplete-results">
                {autocompleteResults.map((monument) => (
                  <li
                    key={monument._id}
                    onClick={() => handleAutocompleteSelect(monument)}
                    className="navbar-autocomplete-item"
                  >
                    {monument.MonumentName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="navbar-search-button">
            <SearchIcon />
          </button>
        </form>

        <nav className="navbar-menu">
          {pages.map((page) => (
            <Link
              key={page.label}
              to={page.path}
              className={`navbar-item ${location.pathname === page.path ? 'navbar-item-active' : ''}`}
            >
              {page.icon}
              <span className="navbar-item-label">{page.label}</span>
            </Link>
          ))}

          <button onClick={() => navigate('/profile')} className="navbar-profile">
            <AccountCircleIcon />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
