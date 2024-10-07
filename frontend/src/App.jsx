// src/App.jsx
import './styles/App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Transactions from './pages/Transactions'; // Correct import name
import Statistics from './pages/Statistics';
import Header from './components/Header'; // Import the Header component

function App() {
  return (
    <Router>
      <div>
        <Header /> {/* Use Header for navigation */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="*" element={<NotFound />} /> {/* 404 Route */}
        </Routes>
      </div>
    </Router>
  );
}

const NotFound = () => (
  <div className="container my-4">
    <h2 className="text-center">404 - Not Found</h2>
    <p className="lead text-center">Sorry, the page you are looking for does not exist.</p>
  </div>
);

export default App;
