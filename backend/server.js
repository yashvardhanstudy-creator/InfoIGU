require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");
const app = express();
const multer = require("multer");
const nodemailer = require("nodemailer");

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

// Configure CORS for production security
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

    // Allow requests with no origin (like mobile apps or curl) or explicitly allowed origin
    if (
      !origin ||
      origin === allowedOrigin ||
      origin === "http://localhost:5173"
    ) {
      return callback(null, true);
    }

    // Dynamically allow any local network IP (e.g., http://192.168.x.x:port)
    if (/^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
console.log(__dirname);
app.use("/", express.static(path.join(__dirname, "public")));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
  res.json("Welcome to the InfoIGU Backend! port:" + port);
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

// Change Password endpoint
app.post("/api/change-password", async (req, res) => {
  const { name, oldPassword, newPassword } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE name = $2 AND password = $3 RETURNING *",
      [newPassword, name, oldPassword],
    );
    if (result.rows.length > 0) {
      res.json({ success: true, message: "Password updated successfully" });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Incorrect current password" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Execute arbitrary SQL (Dev only)
app.post("/api/execute-sql", async (req, res) => {
  const { name, query } = req.body;
  if (name !== "dev") {
    return res
      .status(403)
      .json({ success: false, error: "Unauthorized access." });
  }
  try {
    const result = await pool.query(query);
    res.json({
      success: true,
      rows: result.rows,
      command: result.command,
      rowCount: result.rowCount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin table data endpoint
app.post("/api/admin/table-data", async (req, res) => {
  const { name, table } = req.body;
  if (name !== "admin") {
    return res
      .status(403)
      .json({ success: false, error: "Unauthorized access." });
  }

  const validTables = [
    "users",
    "education",
    "books",
    "publications",
    "patents",
    "honors",
    "projects",
    "collaborations",
    "memberships",
    "teaching_engagements",
    "supervisions",
    "associate_scholars",
    "events",
    "visits",
    "administrative_positions",
    "miscellaneous",
  ];

  if (!validTables.includes(table)) {
    return res.status(400).json({ success: false, error: "Invalid table." });
  }

  try {
    let queryStr = `SELECT * FROM ${table}`;
    // For all tables except 'users', join the users table to fetch the user's name
    if (table !== "users") {
      queryStr = `SELECT u.name AS user_name, t.* FROM ${table} t LEFT JOIN users u ON t.u_id = u.id`;
    }
    const result = await pool.query(queryStr);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/send-email", async (req, res) => {
  const { department, userEmail, subject, message } = req.body;
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // To send to the department instead, you can map 'department' to an email address here
      replyTo: userEmail,
      subject: `[Contact Form - ${department.toUpperCase()}] ${subject}`,
      text: `You have received a new query from: ${userEmail}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Contact Form] Email successfully sent! Subject: ${subject}`);

    res
      .status(200)
      .json({ success: true, message: "Query received successfully" });
  } catch (err) {
    console.error("Error sending email:", err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/education/:id/:type", async (req, res) => {
  try {
    // console.log(req.params.id);
    const result = await pool.query(
      "SELECT * FROM education WHERE u_id = $1 AND type = $2",
      [Number(req.params.id), req.params.type],
    );
    // console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(req.params.id);
  }
});

app.post("/api/education/:id", async (req, res) => {
  try {
    const { head, date_range, type } = req.body;
    if (type !== "education" && type !== "profession") {
      return res
        .status(400)
        .json({ error: "Invalid type. Must be 'education' or 'profession'." });
    }

    const result = await pool.query(
      "INSERT INTO education (u_id, head, date_range, type) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.params.id, head, date_range, type],
    );
    // console.log(result);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/education/:id/:record_id", async (req, res) => {
  try {
    const { head, date_range, type } = req.body;
    const result = await pool.query(
      "UPDATE education SET head = $1, date_range = $2, type = $3 WHERE u_id = $4 AND id = $5 RETURNING *",
      [head, date_range, type, req.params.id, req.params.record_id],
    );
    res.json(result.rows[0]);
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
    // console.log(req.body);
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
    // console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/research_interests/:id", async (req, res) => {
  try {
    const { research_interests } = req.body;
    const result = await pool.query(
      "UPDATE users SET research_interests = $1 WHERE id = $2 RETURNING *",
      [research_interests, req.params.id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/education/:id/:record_id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM education WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.record_id],
    );
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

app.put("/api/books/:id/:bookId", async (req, res) => {
  try {
    const { title, isbn, publish_date, edition, authors, url } = req.body;
    const result = await pool.query(
      "UPDATE books SET title = $1, isbn = $2, publish_date = $3, edition = $4, authors = $5, url = $6 WHERE u_id = $7 AND id = $8 RETURNING *",
      [
        title,
        isbn,
        publish_date,
        edition,
        authors,
        url,
        req.params.id,
        req.params.bookId,
      ],
    );
    res.json(result.rows[0]);
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

app.put("/api/publications/:id/:publicationId", async (req, res) => {
  try {
    const { title, publish_date, url } = req.body;
    const result = await pool.query(
      "UPDATE publications SET title = $1, publish_date = $2, url = $3 WHERE u_id = $4 AND id = $5 RETURNING *",
      [title, publish_date, url, req.params.id, req.params.publicationId],
    );
    res.json(result.rows[0]);
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

app.put("/api/patents/:id/:patentId", async (req, res) => {
  try {
    const { title, status, patent_number, application_number, inventors, url } =
      req.body;
    const result = await pool.query(
      "UPDATE patents SET title = $1, status = $2, inventors = $3, patent_number = $4, application_number = $5, url = $6 WHERE u_id = $7 AND id = $8 RETURNING *",
      [
        title,
        status,
        inventors,
        patent_number,
        application_number,
        url,
        req.params.id,
        req.params.patentId,
      ],
    );
    res.json(result.rows[0]);
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
    const result = await pool.query("SELECT * FROM honors WHERE u_id = $1", [
      Number(req.params.id),
    ]);
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
      "INSERT INTO honors (u_id, title, date_issued, discription, url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.params.id, title, date_issued, description, url],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/honors/:id/:honorId", async (req, res) => {
  try {
    const { title, date_issued, description, url } = req.body;
    const result = await pool.query(
      "UPDATE honors SET title = $1, date_issued = $2, discription = $3, url = $4 WHERE u_id = $5 AND id = $6 RETURNING *",
      [title, date_issued, description, url, req.params.id, req.params.honorId],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/honors/:id/:honorId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM honors WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.honorId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Projects Endpoints ---
app.get("/api/projects/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects WHERE u_id = $1", [
      Number(req.params.id),
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/projects/:id", async (req, res) => {
  try {
    const {
      topic,
      start_date,
      field,
      financial_outlay,
      funding_agency,
      other_officers,
      url,
    } = req.body;
    const result = await pool.query(
      "INSERT INTO projects (u_id, topic, start_date, field, financial_outlay, funding_agency, other_officers, url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        req.params.id,
        topic,
        start_date,
        field,
        financial_outlay,
        funding_agency,
        other_officers,
        url,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/projects/:id/:itemId", async (req, res) => {
  try {
    const {
      topic,
      start_date,
      field,
      financial_outlay,
      funding_agency,
      other_officers,
      url,
    } = req.body;
    const result = await pool.query(
      "UPDATE projects SET topic = $1, start_date = $2, field = $3, financial_outlay = $4, funding_agency = $5, other_officers = $6, url = $7 WHERE u_id = $8 AND id = $9 RETURNING *",
      [
        topic,
        start_date,
        field,
        financial_outlay,
        funding_agency,
        other_officers,
        url,
        req.params.id,
        req.params.itemId,
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/projects/:id/:itemId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM projects WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.itemId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Collaborations Endpoints ---
app.get("/api/collaborations/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM collaborations WHERE u_id = $1",
      [Number(req.params.id)],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/collaborations/:id", async (req, res) => {
  try {
    const { title, organization, url, description, date_range } = req.body;
    const result = await pool.query(
      "INSERT INTO collaborations (u_id, title, organization, url, description, date_range) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [req.params.id, title, organization, url, description, date_range],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/collaborations/:id/:itemId", async (req, res) => {
  try {
    const { title, organization, url, description, date_range } = req.body;
    const result = await pool.query(
      "UPDATE collaborations SET title = $1, organization = $2, url = $3, description = $4, date_range = $5 WHERE u_id = $6 AND id = $7 RETURNING *",
      [
        title,
        organization,
        url,
        description,
        date_range,
        req.params.id,
        req.params.itemId,
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/collaborations/:id/:itemId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM collaborations WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.itemId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Memberships Endpoints ---
app.get("/api/memberships/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM memberships WHERE u_id = $1",
      [Number(req.params.id)],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/memberships/:id", async (req, res) => {
  try {
    const { organization, role, date_range } = req.body;
    const result = await pool.query(
      "INSERT INTO memberships (u_id, organization, role, date_range) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.params.id, organization, role, date_range],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/memberships/:id/:itemId", async (req, res) => {
  try {
    const { organization, role, date_range } = req.body;
    const result = await pool.query(
      "UPDATE memberships SET organization = $1, role = $2, date_range = $3 WHERE u_id = $4 AND id = $5 RETURNING *",
      [organization, role, date_range, req.params.id, req.params.itemId],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/memberships/:id/:itemId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM memberships WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.itemId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Teaching Engagements Endpoints ---
app.get("/api/teaching_engagements/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM teaching_engagements WHERE u_id = $1",
      [Number(req.params.id)],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/teaching_engagements/:id", async (req, res) => {
  try {
    const { course_name, level, date_range } = req.body;
    const result = await pool.query(
      "INSERT INTO teaching_engagements (u_id, course_name, level, date_range) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.params.id, course_name, level, date_range],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/teaching_engagements/:id/:itemId", async (req, res) => {
  try {
    const { course_name, level, date_range } = req.body;
    const result = await pool.query(
      "UPDATE teaching_engagements SET course_name = $1, level = $2, date_range = $3 WHERE u_id = $4 AND id = $5 RETURNING *",
      [course_name, level, date_range, req.params.id, req.params.itemId],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/teaching_engagements/:id/:itemId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM teaching_engagements WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.itemId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Supervisions Endpoints ---
app.get("/api/supervisions/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM supervisions WHERE u_id = $1",
      [Number(req.params.id)],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/supervisions/:id", async (req, res) => {
  try {
    const { student_name, topic, status, date_range } = req.body;
    const result = await pool.query(
      "INSERT INTO supervisions (u_id, student_name, topic, status, date_range) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.params.id, student_name, topic, status, date_range],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/supervisions/:id/:itemId", async (req, res) => {
  try {
    const { student_name, topic, status, date_range } = req.body;
    const result = await pool.query(
      "UPDATE supervisions SET student_name = $1, topic = $2, status = $3, date_range = $4 WHERE u_id = $5 AND id = $6 RETURNING *",
      [
        student_name,
        topic,
        status,
        date_range,
        req.params.id,
        req.params.itemId,
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/supervisions/:id/:itemId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM supervisions WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.itemId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Associate Scholars Endpoints ---
app.get("/api/associate_scholars/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM associate_scholars WHERE u_id = $1",
      [Number(req.params.id)],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/associate_scholars/:id", async (req, res) => {
  try {
    const { scholar_name, topic, date_range } = req.body;
    const result = await pool.query(
      "INSERT INTO associate_scholars (u_id, scholar_name, topic, date_range) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.params.id, scholar_name, topic, date_range],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/associate_scholars/:id/:itemId", async (req, res) => {
  try {
    const { scholar_name, topic, date_range } = req.body;
    const result = await pool.query(
      "UPDATE associate_scholars SET scholar_name = $1, topic = $2, date_range = $3 WHERE u_id = $4 AND id = $5 RETURNING *",
      [scholar_name, topic, date_range, req.params.id, req.params.itemId],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/associate_scholars/:id/:itemId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM associate_scholars WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.itemId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Events Endpoints ---
app.get("/api/events/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events WHERE u_id = $1", [
      Number(req.params.id),
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/events/:id", async (req, res) => {
  try {
    const { event_name, role, date_range, location } = req.body;
    const result = await pool.query(
      "INSERT INTO events (u_id, event_name, role, date_range, location) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.params.id, event_name, role, date_range, location],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/events/:id/:itemId", async (req, res) => {
  try {
    const { event_name, role, date_range, location } = req.body;
    const result = await pool.query(
      "UPDATE events SET event_name = $1, role = $2, date_range = $3, location = $4 WHERE u_id = $5 AND id = $6 RETURNING *",
      [
        event_name,
        role,
        date_range,
        location,
        req.params.id,
        req.params.itemId,
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/events/:id/:itemId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM events WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.itemId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Visits Endpoints ---
app.get("/api/visits/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM visits WHERE u_id = $1", [
      Number(req.params.id),
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/visits/:id", async (req, res) => {
  try {
    const { location, purpose, date_range } = req.body;
    const result = await pool.query(
      "INSERT INTO visits (u_id, location, purpose, date_range) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.params.id, location, purpose, date_range],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/visits/:id/:itemId", async (req, res) => {
  try {
    const { location, purpose, date_range } = req.body;
    const result = await pool.query(
      "UPDATE visits SET location = $1, purpose = $2, date_range = $3 WHERE u_id = $4 AND id = $5 RETURNING *",
      [location, purpose, date_range, req.params.id, req.params.itemId],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/visits/:id/:itemId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM visits WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.itemId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Administrative Positions Endpoints ---
app.get("/api/administrative_positions/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM administrative_positions WHERE u_id = $1",
      [Number(req.params.id)],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/administrative_positions/:id", async (req, res) => {
  try {
    const { position, organization, date_range } = req.body;
    const result = await pool.query(
      "INSERT INTO administrative_positions (u_id, position, organization, date_range) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.params.id, position, organization, date_range],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/administrative_positions/:id/:itemId", async (req, res) => {
  try {
    const { position, organization, date_range } = req.body;
    const result = await pool.query(
      "UPDATE administrative_positions SET position = $1, organization = $2, date_range = $3 WHERE u_id = $4 AND id = $5 RETURNING *",
      [position, organization, date_range, req.params.id, req.params.itemId],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/administrative_positions/:id/:itemId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM administrative_positions WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.itemId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Miscellaneous Endpoints ---
app.get("/api/miscellaneous/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM miscellaneous WHERE u_id = $1",
      [Number(req.params.id)],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/miscellaneous/:id", async (req, res) => {
  try {
    const { title, description, date_range } = req.body;
    const result = await pool.query(
      "INSERT INTO miscellaneous (u_id, title, description, date_range) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.params.id, title, description, date_range],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/miscellaneous/:id/:itemId", async (req, res) => {
  try {
    const { title, description, date_range } = req.body;
    const result = await pool.query(
      "UPDATE miscellaneous SET title = $1, description = $2, date_range = $3 WHERE u_id = $4 AND id = $5 RETURNING *",
      [title, description, date_range, req.params.id, req.params.itemId],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/miscellaneous/:id/:itemId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM miscellaneous WHERE u_id = $1 AND id = $2",
      [req.params.id, req.params.itemId],
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
