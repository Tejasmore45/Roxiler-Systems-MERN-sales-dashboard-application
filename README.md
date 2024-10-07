# Sales Dashboard Application

This project provides an insightful sales dashboard with statistics, bar charts, and pie charts.

## How to Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/Tejasmore45/Roxiler-Systems-MERN-sales-dashboard-application.git
2. Navigate to the backend directory - cd backend

3. Install backend dependencies: npm install

4. Create a .env file in the backend directory with the following content:  MONGO_URI=your-mongodb-connection-string

5.  Start the backend server: npm start

6. Navigate to the frontend directory: cd frontend

7. Install frontend dependencies: npm install
 
8. Start the React development server: npm run dev

9. Interacting with the Application
Open http://localhost:5173 in your browser to view the frontend.
Use the Month dropdown and Search box to filter transactions.
Click Next and Previous to navigate through pages of transactions.

## API Endpoints

Backend API Endpoints:
 1. List Transactions with Pagination: GET /api/transactions?month=3&page=1&perPage=10

2.  Get Statistics for a Selected Month:  GET /api/transactions/statistics?month=3&year=2021

3. Bar Chart Data (by price range):  GET /api/transactions/bar-chart?month=3&year=2021

4. Pie Chart Data (by category): GET /api/transactions/pie-chart?month=3&year=2021
