import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const client = await pool.connect(); // get dedicated connection (needed for transactions)

  try {
    // Extracted from request body
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Normalize email (avoid duplicates like Test@gmail.com vs test@gmail.com)
    const normalizedEmail = email.toLowerCase().trim();

    // Start transaction
    await client.query("BEGIN");

    // 1. Check if user exists
    const userExists = await client.query(
      //$1 → parameterized query (prevents SQL injection)
      "SELECT 1 FROM users WHERE email = $1",
      [normalizedEmail]
    );

    // If user exists → stop execution,Return HTTP 400 (Bad Request)
    if (userExists.rows.length > 0) {
      await client.query("ROLLBACK"); // rollback before returning
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert user in db
    const newUser = await client.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, normalizedEmail, hashedPassword]
    );

    // 👉 Example: future multi-step logic can go here safely
    // e.g., create profile, settings, categories, etc.

    // Commit transaction (everything succeeded)
    await client.query("COMMIT");

    // 4. Generate token
    const token = generateToken(newUser.rows[0].id);

    res.status(201).json({
      user: newUser.rows[0],
      token,
    });

  } catch (error) {
    // Rollback if anything fails
    await client.query("ROLLBACK");

    // Handle duplicate email (if DB constraint exists)
    if (error.code === "23505") {
      return res.status(400).json({ message: "User already exists" });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });

  } finally {
    // ALWAYS release connection back to pool
    client.release();
  }
};

//no transacn coz only reads, no writes
export const loginUser = async (req, res) => {
  try {
    // Extracted from request body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find user
    const userResult = await pool.query(
      "SELECT id, name, email, password FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};