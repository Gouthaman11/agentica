import "dotenv/config";
import mysql from "mysql2/promise";

const dbPort = Number(process.env.DB_PORT ?? 3306);

export const db = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "bank_extractor",
  port: Number.isNaN(dbPort) ? 3306 : dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function checkDbConnection() {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    console.log("MySQL connected");
  } catch (error) {
    console.error("DB connection failed:", error);
  }
}
