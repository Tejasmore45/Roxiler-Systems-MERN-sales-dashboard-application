// src/pages/About.jsx
import React from 'react';

function About() {
  return (
    <div className="container my-4">
      {/* Main heading for the page (SEO-friendly) */}
      <h1 className="text-center">About This Application</h1>
      
      <p className="lead text-center">
        This application is a statistics dashboard that provides insights into sales data.
      </p>
      
      <div className="card mb-4">
        <div className="card-header">
          <h4>Features</h4>
        </div>
        <div className="card-body">
          <ul>
            <li>View total sales, sold items, and unsold items.</li>
            <li>Analyze data with bar and pie charts.</li>
            <li>Filter data by month and year.</li>
            <li>Responsive design for mobile and desktop.</li>
          </ul>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h4>Technologies Used</h4>
        </div>
        <div className="card-body">
          <ul>
            <li>React for the frontend</li>
            <li>Express.js for the backend</li>
            <li>MongoDB for data storage</li>
            <li>Chart.js for data visualization</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;
