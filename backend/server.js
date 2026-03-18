require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");
const app = express();
const multer = require("multer");

const port = process.env.SERVER_PORT || 5000;

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER || "postgres",
  host: process.env.HOST || "localhost",
  database: process.env.POSTGRES_DB || "test",
  password: process.env.POSTGRES_PASSWORD || "123456789",
  port: process.env.POSTGRES_PORT || 5432,
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
console.log(__dirname);
app.use("/", express.static(path.join(__dirname, "public")));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public"));
  },
  filename: (req, file, cb) => {
    // Access data from req.body
    const userName = req.body.name || "unknown";
    const dept = req.body.department || "general";

    // Create new filename: JohnDoe_Engineering.png (Matches frontend)
    const newFilename = `${userName}_${dept}.png`;

    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });
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
  res.json("Hello to the Backend!");
});

// Register endpoint
app.post("/api/register", async (req, res) => {
  const { name, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *",
      [name, password],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { name, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE name = $1 AND password = $2",
      [name, password],
    );
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/profiles/profile/:name", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users where name = $1", [
      req.params.name,
    ]);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/show", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/update", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body);
    const query =
      "update users set designation = $1, department = $2, phone=$3, email=$4, name=$5 where name = $6";
    const values = [
      req.body.designation,
      req.body.department,
      req.body.phone,
      req.body.email,
      req.body.name,
      req.body.oldname,
    ];
    const result = await pool.query(query, values);
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
