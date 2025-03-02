import express from 'express';
import pg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const { Pool } = pg;

// 🔹 PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hotel_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully! Current Time:', res.rows[0].now);
  }
});

// 🔹 JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// 🔹 Middleware: Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// 🔹 Register User (Signup)
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // 🔹 Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 🔹 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Insert user into DB (default role: 'user')
    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, 'user']
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 🔹 Check if User Exists (For Reset Password)
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
      if (user.rows.length === 0) {
        return res.status(404).json({ message: 'User not found', exists: false });
      }
  
      res.json({ message: 'User found. Proceed to reset password.', exists: true });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
  // ✅ Reset Password Route
  app.post('/reset-password', async (req, res) => {
    const { email, password, confirmPassword } = req.body;
  
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    try {
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
      if (user.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
  
      res.json({ message: 'Password updated successfully!' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  

// 🔹 Login User
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // 🔹 Check if user exists
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 🔹 Verify Password
    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 🔹 Generate JWT Token
    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email, role: user.rows[0].role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.rows[0].id, email: user.rows[0].email, role: user.rows[0].role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 🔹 Get User Profile (Protected Route)
app.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [req.user.id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post("/registeringformforhostel", async (req, res) => {
  const { id, FullName, FatherName, email, phoneNumber, Dept, hostelType, mess_type, address } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Step 1: Check if the email already exists
    const existingUser = await pool.query(
      "SELECT * FROM hostel_registrations WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered!" }); // 409 Conflict
    }

    // Step 2: Insert new user if email is not found
    const result = await pool.query(
      `INSERT INTO hostel_registrations 
        (user_id, full_name, father_name, email, phone_number, department, hostel_type, mess_type, address) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [id, FullName, FatherName, email, phoneNumber, Dept, hostelType, mess_type, address]
    );
    

    res.status(201).json({ message: "Registration successful!", data: result.rows[0] });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});
app.get("/hostel-registrations", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        hr.user_id, 
        u.email AS user_name,  -- Fetching user_name (email) from users table
        hr.full_name, 
        hr.father_name, 
        hr.email, 
        hr.phone_number, 
        hr.department, 
        hr.hostel_type, 
        hr.mess_type, 
        hr.address 
      FROM hostel_registrations hr
      JOIN users u ON hr.user_id = u.id` // Joining with users table
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching hostel registrations:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});


app.put("/registeringformforhostel/:id", async (req, res) => {
  const { id } = req.params;
  const { full_name, father_name, address, phone_number, department, hostel_type, mess_type } = req.body;

  // 🛠️ Check if all required fields are present
  if (!full_name || !father_name || !address || !phone_number || !department || !hostel_type || !mess_type) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const result = await pool.query(
      `UPDATE hostel_registrations 
       SET full_name = $1, father_name = $2, address = $3, phone_number = $4, 
           department = $5, hostel_type = $6, mess_type = $7 
       WHERE user_id = $8 
       RETURNING *`,
      [full_name, father_name, address, phone_number, department, hostel_type, mess_type, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json({ message: "Update successful!", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});


app.get("/registeringformforhostel/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM hostel_registrations WHERE user_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.get("/check-registration/:id", async (req, res) => {
  const { id } = req.params;
console.log(id)
  try {
    const result = await pool.query(
      "SELECT * FROM hostel_registrations WHERE user_id = $1",
      [id]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({ registered: true });
    } else {
      return res.status(200).json({ registered: false });
    }
  } catch (error) {
    console.error("Error checking registration:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});
app.post("/api/complaints", async (req, res) => {
  const { user_id, complaint, date, status } = req.body; 
  try {
    const result = await pool.query(
      "INSERT INTO complaints (user_id, complaint, date, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, complaint, date, status || 'Pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting complaint:", error);
    res.status(500).json({ error: "Database error" });
  }
});
app.post("/api/recent-activities", async (req, res) => {
  const { user_id, activity, date, status } = req.body; 
  try {
    const result = await pool.query(
      "INSERT INTO recent_activities (user_id, activity, date, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, activity, date, status || 'Pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting recent activity:", error);
    res.status(500).json({ error: "Database error" });
  }
});
app.post("/api/requests", async (req, res) => {
  const { user_id, request, date, status } = req.body; 
  try {
    const result = await pool.query(
      "INSERT INTO requests (user_id, request, date, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, request, date, status || 'Pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting request:", error);
    res.status(500).json({ error: "Database error" });
  }
});

////get com, recentactiviy,request
// Get Recent Activities for a Specific User
app.get("/api/recent-activities/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM recent_activities WHERE user_id = $1 ORDER BY date DESC",
      [user_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Get Requests for a Specific User
app.get("/api/requests/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM requests WHERE user_id = $1 ORDER BY date DESC",
      [user_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Get Complaints for a Specific User
app.get("/api/complaints/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM complaints WHERE user_id = $1 ORDER BY date DESC",
      [user_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/allusersdetails", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM public.users ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Get All Requests
app.get("/total-requests", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM requests ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get All Complaints
app.get("/total-complaints", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM complaints ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get All Recent Activities (Latest First)
app.get("/recent-activity", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recent_activities");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/admin/users-with-complaints", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        users.id AS user_id, 
        users.email, 
        users.role, 
        complaints.id AS complaint_id, 
        complaints.complaint, 
        complaints.date, 
        complaints.status
      FROM users
      LEFT JOIN complaints ON users.id = complaints.user_id
      ORDER BY users.id ASC;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users with complaints:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});
app.put("/admin/update-complaint/:complaint_id", async (req, res) => {
  const { complaint_id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const result = await pool.query(
      `UPDATE complaints SET status = $1 WHERE id = $2 RETURNING *`,
      [status, complaint_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.status(200).json({ message: "Complaint status updated successfully" });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});
app.get("/admin/complaints", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, u.email AS user_name, c.complaint, c.date, c.status
      FROM complaints c
      JOIN users u ON c.user_id = u.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.get("/admin/recent-activities", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ra.id, u.email AS user_name, ra.activity, ra.date, ra.status
      FROM recent_activities ra
      JOIN users u ON ra.user_id = u.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});
app.get("/admin/requests", async (req, res) => {
  try {
  
    const result = await pool.query(`
      SELECT ra.id, u.email AS user_name, ra.request, ra.date, ra.status
      FROM requests ra
      JOIN users u ON ra.user_id = u.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

// Update activity status
app.put("/admin/update-activity/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query("UPDATE recent_activities SET status = $1 WHERE id = $2", [status, id]);
    res.json({ success: true, message: "Activity status updated successfully" });
  } catch (error) {
    console.error("Error updating activity status:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});


// Update request status
app.put("/admin/update-request/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query("UPDATE requests SET status = $1 WHERE id = $2", [status, id]);
    res.json({ message: "Request status updated successfully!" });
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.get("/matched-users", async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.email, h.full_name, h.phone_number AS number, 
             h.department AS dept
      FROM users u
      JOIN hostel_registrations h ON u.id = h.user_id
      ORDER BY u.id ASC
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching matched users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/matched-users", async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.email, h.full_name, h.phone_number AS number, 
             h.department AS dept, a.status AS attendance_status
      FROM users u
      JOIN hostel_registrations h ON u.id = h.user_id
      LEFT JOIN attendance a ON u.id = a.user_id
      ORDER BY u.id ASC
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching matched users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/attendance", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.user_id, u.email, a.attendance_date, a.status 
       FROM attendance a 
       JOIN users u ON a.user_id = u.id
       ORDER BY a.attendance_date DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.post("/attendance", async (req, res) => {
  const { user_id, attendance_date, status } = req.body;

  try {
    if (!user_id || !attendance_date || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if attendance already exists for this user and date
    const checkExisting = await pool.query(
      "SELECT * FROM attendance WHERE user_id = $1 AND attendance_date = $2",
      [user_id, attendance_date]
    );

    if (checkExisting.rows.length > 0) {
      return res.status(400).json({ error: "Attendance for this date already exists!" });
    }

    // Insert new attendance record
    const result = await pool.query(
      `INSERT INTO attendance (user_id, attendance_date, status) 
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, attendance_date, status]
    );

    res.json({ message: "Attendance marked successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Database error occurred" });
  }
});

// ✅ Check if attendance exists
app.get("/check-attendance", async (req, res) => {
  try {
    const { user_id, date } = req.query;
    const query = "SELECT 1 FROM attendance WHERE user_id = $1 AND attendance_date = $2";
    const result = await pool.query(query, [user_id, date]);

    res.json({ exists: result.rowCount > 0 });
  } catch (error) {
    console.error("Error checking attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update attendance if it exists
app.put("/update-attendance", async (req, res) => {
  try {
    const { user_id, attendance_date, status } = req.body;
    const query = "UPDATE attendance SET status = $1 WHERE user_id = $2 AND attendance_date = $3";
    await pool.query(query, [status, user_id, attendance_date]);

    res.json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/user_attendance", async (req, res) => {
  try {
    console.log("Received request for /user_attendance", req.query);
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const sql = `
      SELECT 
        hr.full_name AS name, 
        hr.email, 
        hr.department, 
        a.attendance_date, 
        a.status
      FROM attendance a
      JOIN hostel_registrations hr ON a.user_id = hr.user_id
      WHERE a.user_id = $1
      ORDER BY a.attendance_date DESC
    `;

    const { rows } = await pool.query(sql, [user_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No attendance records found for this user" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error fetching attendance records:", err);
    res.status(500).json({ error: "Error fetching attendance records" });
  }
});
// Get Mess & Attendance Details for a User
app.get("/mess_details", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch attendance records
    const attendanceQuery = `
      SELECT attendance_date, status
      FROM attendance
      WHERE user_id = $1
      ORDER BY attendance_date DESC;
    `;
    const attendanceResult = await pool.query(attendanceQuery, [user_id]);

    // Fetch hostel details
    const hostelQuery = `
      SELECT full_name, hostel_type, mess_type
      FROM hostel_registrations
      WHERE user_id = $1;
    `;
    const hostelResult = await pool.query(hostelQuery, [user_id]);

    if (hostelResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found in hostel records" });
    }

    // Response structure
    const response = {
      attendance: attendanceResult.rows,
      hostel: hostelResult.rows[0],
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching mess details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/api/delete-user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    // Start transaction
    await pool.query("BEGIN");

    // Delete related data first
    await pool.query("DELETE FROM attendance WHERE user_id = $1", [user_id]);
    await pool.query("DELETE FROM complaints WHERE user_id = $1", [user_id]);
    await pool.query("DELETE FROM requests WHERE user_id = $1", [user_id]);
    await pool.query("DELETE FROM recent_activities WHERE user_id = $1", [user_id]);
    await pool.query("DELETE FROM hostel_registrations WHERE user_id = $1", [user_id]);

    // Delete user from `users` table
    await pool.query("DELETE FROM users WHERE id = $1", [user_id]);

    // Commit transaction
    await pool.query("COMMIT");

    res.status(200).json({ message: "User and related data deleted successfully." });
  } catch (error) {
    await pool.query("ROLLBACK"); // Rollback transaction on error
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user." });
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id AS user_id, 
        h.full_name, 
        h.department, 
        h.email 
      FROM users u
      RIGHT JOIN hostel_registrations h ON u.id = h.user_id;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
