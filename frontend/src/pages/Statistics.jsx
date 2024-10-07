// src/pages/Statistics.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import '../styles/ChartStyles.css'; // Import styles for charts

function Statistics() {
  const [month, setMonth] = useState('3'); // Default to March
  const [year, setYear] = useState('2022'); // Default to 2022
  const [stats, setStats] = useState({ totalSales: 0, totalSoldItems: 0, totalNotSoldItems: 0 });
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      setError(null);   // Reset errors

      try {
        const [statsResponse, barDataResponse, pieDataResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/transactions/statistics?month=${month}&year=${year}`),
          axios.get(`http://localhost:5000/api/transactions/bar-chart?month=${month}&year=${year}`),
          axios.get(`http://localhost:5000/api/transactions/pie-chart?month=${month}&year=${year}`)
        ]);

        setStats(statsResponse.data);
        setBarData(barDataResponse.data);
        setPieData(pieDataResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data.'); // Improved error handling
      } finally {
        setLoading(false); // Stop loading in both success and error cases
      }
    };

    if (month && year) {
      fetchData();
    }
  }, [month, year]);

  return (
    <div className="container">
      <h2 className="my-4">Statistics</h2>

      <div className="form-group">
        <label htmlFor="month-select">Select Month:</label>
        <select
          id="month-select"
          className="form-control"
          value={month}
          onChange={e => setMonth(e.target.value)}
        >
          <option value="">--Please choose a month--</option>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index + 1} value={index + 1}>{new Date(0, index).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="year-select">Select Year:</label>
        <select
          id="year-select"
          className="form-control"
          value={year}
          onChange={e => setYear(e.target.value)}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <option key={2021 + index} value={2021 + index}>{2021 + index}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading statistics...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <p>Total Sales: ${stats.totalSales.toFixed(2)}</p>
          <p>Total Sold Items: {stats.totalSoldItems}</p>
          <p>Total Not Sold Items: {stats.totalNotSoldItems}</p>

          
          <div className="chart-container">
            <BarChart data={barData} />
          </div>

          <div className="chart-container">
            <PieChart data={pieData} />
          </div>
        </>
      )}
    </div>
  );
}

export default Statistics;
