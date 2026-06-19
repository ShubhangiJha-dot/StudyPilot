import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();
const { Pool, types } = pkg;

types.setTypeParser(1082, (val) => val); //date n time ko string mein store karna to avoid timezone issues
//coz neon needs ssl
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error:', err);
  process.exit(-1);
});

process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await pool.end();
  console.log("Database connection closed.");
  process.exit(0);
});

export default pool;