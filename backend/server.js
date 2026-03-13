const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 5000; // Choose a different port from the frontend

// PostgreSQL connection pool
const pool = new Pool({
  user: "your_username", // Replace with your PostgreSQL username
  host: "localhost",
  database: "your_database", // Replace with your PostgreSQL database name
  password: "your_password", // Replace with your PostgreSQL password
  port: 5432,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("PostgreSQL connected:", result.rows[0].now);
  });
});

// Basic API endpoint
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
