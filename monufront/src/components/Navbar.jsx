import React from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css'; // Import the CSS for styling

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Monuments</Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/feedback" className="navbar-link">Feedback</Link>
          </li>
          
          
          <li className="navbar-item">
            <Link to="/event-show" className="navbar-link">Event Show</Link>
          </li>
         
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
