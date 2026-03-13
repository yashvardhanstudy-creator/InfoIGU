require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.SERVER_PORT || 5000; // Choose a different port from the frontend

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER || "postgres", // Replace with your PostgreSQL username
  host: process.env.HOST || "localhost",
  database: process.env.POSTGRES_DB, // Replace with your PostgreSQL database name
  password: process.env.POSTGRES_PASSWORD, // Replace with your PostgreSQL password
  port: process.env.POSTGRES_PORT || 5432,
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
app.get("/api/profiles/profile:data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM your_table_name"); // Replace with your actual table name
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/:profile", (req, res) => {
  res.send("Hello from the backend!");
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
