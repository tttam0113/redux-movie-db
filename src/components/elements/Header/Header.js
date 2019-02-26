import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import './Header.css';

const Header = () => (
  <div className="rmdb-header">
    <div className="rmdb-header-content">
      <Link to="/">
        <img className="rmdb-logo" src="/images/reactMovie_logo.png" alt="rmdb-logo" />
      </Link>
      <div className="rmdb-references">
        <a
          className="rmdb-fa-github"
          href="https://github.com/tttam0113/react-movie-db"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesome name="github" size="3x" />
        </a>
        <img className="rmdb-tmdb-logo" src="/images/tmdb_logo.png" alt="tmdb-logo" />
      </div>
    </div>
  </div>
);

export default Header;
