// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';  // Import Link for routing

function Home() {
  return (
    <div className="container my-4">
      {/* Page title for better SEO */}
      <h1 className="text-center">Welcome to the Sales Dashboard</h1>
      <p className="lead text-center">
        This application provides insightful analytics on sales transactions.
      </p>

      <div className="card mb-4">
        <div className="card-header">
          <h4>Key Features</h4>
        </div>
        <div className="card-body">
          <ul>
            <li>View comprehensive sales statistics.</li>
            <li>Interactive charts for better data visualization.</li>
            <li>Filter results by month and year.</li>
            <li>Responsive design for seamless access on any device.</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        {/* Using Link component for internal routing */}
        <Link to="/statistics" className="btn btn-primary btn-lg">
          View Statistics
        </Link>
      </div>

      <div className="text-center mt-4">
        <h5>Get Started Now!</h5>
        <p>Explore the application to gain valuable insights into your sales data.</p>
      </div>
    </div>
  );
}

export default Home;
