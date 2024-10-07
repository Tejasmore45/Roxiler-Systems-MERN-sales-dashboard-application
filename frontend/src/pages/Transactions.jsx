import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionList() {
  const [month, setMonth] = useState('3'); // Default to March
  const [year, setYear] = useState('2021'); // Default year
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10); // Transactions per page
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch transactions whenever month, year, page, or search changes
  useEffect(() => {
    fetchTransactions();
  }, [month, year, currentPage, search]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch transactions from the API with search, month, year, and pagination
      const response = await axios.get(`http://localhost:5000/api/transactions`, {
        params: {
          month, // Selected month
          year, // Selected year
          page: currentPage, // Current page for pagination
          perPage, // Number of items per page
          search: search || '' // Search query
        }
      });
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value); // Update search query
    setCurrentPage(1); // Reset to first page on search
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value); // Update selected month
    setCurrentPage(1); // Reset to first page on month change
  };

  const handleYearChange = (e) => {
    setYear(e.target.value); // Update selected year
    setCurrentPage(1); // Reset to first page on year change
  };

  return (
    <div className="container my-4">
      <h2 className="text-center">Transaction List</h2>

      {/* Select Month Dropdown */}
      <div className="form-group">
        <label htmlFor="month-select">Select Month:</label>
        <select
          id="month-select"
          className="form-control"
          value={month}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index + 1}>
              {new Date(0, index).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      {/* Select Year Dropdown */}
      <div className="form-group">
        <label htmlFor="year-select">Select Year:</label>
        <select
          id="year-select"
          className="form-control"
          value={year}
          onChange={handleYearChange}
        >
          {/* You can generate the years dynamically or provide a static list */}
          {Array.from({ length: 5 }, (_, index) => (
            <option key={index} value={2021 + index}>
              {2021 + index}
            </option>
          ))}
        </select>
      </div>

      {/* Search Transactions */}
      <div className="form-group">
        <label htmlFor="search-box">Search Transactions:</label>
        <input
          type="text"
          id="search-box"
          className="form-control"
          value={search}
          onChange={handleSearch}
          placeholder="Search by title, description, or price"
        />
      </div>

      {/* Display transactions or loader */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <table className="table table-striped mt-4">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Date of Sale</th>
                <th>Sold Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map(transaction => (
                  <tr key={transaction._id}>
                    <td>{transaction.title}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.price.toFixed(2)}</td>
                    <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                    <td>{transaction.sold ? 'Yes' : 'No'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TransactionList;
