// src/pages/TransactionList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionList() {
  const [month, setMonth] = useState('3'); // Set default to March
  const [year, setYear] = useState('2021'); // Default year, can be changed
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10); // Number of transactions per page
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [month, currentPage]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions?month=${month}&page=${currentPage}`);
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    if (query) {
      const filteredTransactions = transactions.filter(transaction =>
        transaction.title.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.price.toString().includes(query.replace('$', ''))
      );
      setTransactions(filteredTransactions);
    } else {
      fetchTransactions(); // Reset to original transactions if search box is cleared
    }
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setCurrentPage(1); // Reset to first page when month changes
  };

  return (
    <div className="container my-4">
      <h2 className="text-center">Transaction List</h2>

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
                <td>{transaction.price.toFixed(2)}</td> {/* Display price without $ sign */}
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

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TransactionList;
