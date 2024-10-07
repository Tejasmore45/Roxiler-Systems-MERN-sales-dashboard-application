// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import '../styles/Header.css'; // Optional: Import your CSS for styling

function Header() {
  return (
    <header className="header">
      <h2 className="header-title">Sales Dashboard</h2>
      <nav className="header-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/statistics">Statistics</Link></li>
          <li><Link to="/transactions">Transaction List</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
