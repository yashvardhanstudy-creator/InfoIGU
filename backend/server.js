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

app.get("/api/education/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const result = await pool.query("SELECT * FROM education WHERE u_id = $1", [
      Number(req.params.id),
    ]);
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(req.params.id);
  }
});

app.post("/api/education/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO education (u_id, head, date_range) VALUES ($1, $2, $3) RETURNING *",
      [req.params.id, req.body.head, req.body.date_range],
    );
    console.log(result);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
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

app.delete("/api/education/:id/:head", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM education WHERE u_id = $1 AND head = $2",
      [req.params.id, req.params.head],
    );
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Books Endpoints ---

app.get("/api/books/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books WHERE u_id = $1", [
      Number(req.params.id),
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/books/:id", async (req, res) => {
  try {
    const { title, isbn, publish_date, edition, authors, url } = req.body;
    const result = await pool.query(
      "INSERT INTO books (u_id, title, isbn, publish_date, edition, authors, url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [req.params.id, title, isbn, publish_date, edition, authors, url],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/books/:id/:bookId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM books WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.bookId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/publications/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM publications WHERE u_id = $1",
      [Number(req.params.id)],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/publications/:id", async (req, res) => {
  try {
    const { title, publish_date, url } = req.body;
    const result = await pool.query(
      "INSERT INTO publications (u_id, title, publish_date, url) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.params.id, title, publish_date, url],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/publications/:id/:publicationId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM publications WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.publicationId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/patents/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM patents WHERE u_id = $1", [
      Number(req.params.id),
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/patents/:id", async (req, res) => {
  try {
    const { title, status, patent_number, application_number, inventors, url } =
      req.body;
    const result = await pool.query(
      "INSERT INTO patents (u_id, title, status, inventors, patent_number, application_number, url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        req.params.id,
        title,
        status,
        inventors,
        patent_number,
        application_number,
        url,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/patents/:id/:patentId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM patents WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.patentId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/honors/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM honors_award WHERE u_id = $1",
      [Number(req.params.id)],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/honors/:id", async (req, res) => {
  try {
    const { title, date_issued, description, url } = req.body;
    const result = await pool.query(
      "INSERT INTO honors_award (u_id, title, date_issued, discription, url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.params.id, title, date_issued, description, url],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/honors/:id/:honorId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM patents WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.honorId],
    );
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
