import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

dotenv.config();

const dbPort = Number(process.env.DB_PORT ?? 3306);
const dbHost = process.env.DB_HOST ?? "127.0.0.1";
const dbUser = process.env.DB_USER ?? "root";
const dbPassword = process.env.DB_PASSWORD ?? "";
const dbName = process.env.DB_NAME ?? "bank_extractor";

export const db = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: Number.isNaN(dbPort) ? 3306 : dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function bootstrapDatabase() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      username VARCHAR(80) NOT NULL UNIQUE,
      email VARCHAR(190) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(25) NOT NULL,
      currency VARCHAR(8) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `);
}

export async function checkDbConnection() {
  try {
    await bootstrapDatabase();
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    console.log("MySQL connected and schema ready");
  } catch (error) {
    console.error("DB connection failed:", error);
  }
}
