import React from 'react';
import './nav.css';
import { NavLink } from 'react-router-dom';

const Nav = () => {
  return (
      <nav className="site-nav">
        <div className="nav-container">
          <NavLink className="brand" to="/" aria-label="Safely home">
            SAFELY
          </NavLink>
          <div className="nav-links" aria-label="Main navigation">
            <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/" end>
              Hotels
            </NavLink>
            <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/addhotel">
              Add hotel
            </NavLink>
            <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/edithotel">
              Edit hotel
            </NavLink>
            <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/deletehotel">
              Delete hotels
            </NavLink>
            <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/help">
              Help &amp; Support
            </NavLink>
          </div>
        </div>
      </nav>
  );
};

export default Nav;
