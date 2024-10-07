// src/components/PieChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import PropTypes from 'prop-types'; // Import prop-types for validation

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item._id), // Categories
    datasets: [
      {
        label: 'Number of Transactions',
        data: data.map(item => item.count), // Count for each category
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, // Allow for responsive height
    responsive: true,
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <h4 className="text-center">Transactions by Category</h4> {/* Chart Title */}
      <Pie data={chartData} options={options} />
    </div>
  );
};

// Prop Types for validation
PieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PieChart;
