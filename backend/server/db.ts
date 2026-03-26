import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../.env"),
];

let loadedEnvPath = "";
for (const candidate of envCandidates) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate });
    loadedEnvPath = candidate;
    break;
  }
}

if (loadedEnvPath) {
  console.log(`Loaded env from: ${loadedEnvPath}`);
} else {
  console.warn("No .env file found in expected locations.");
}

const dbPort = Number(process.env.DB_PORT ?? 3306);
const dbHost = process.env.DB_HOST ?? "127.0.0.1";
const dbUser = process.env.DB_USER ?? "root";
const dbPassword = process.env.DB_PASSWORD ?? "";
const dbName = process.env.DB_NAME ?? "bank_extractor";

if (!dbPassword) {
  console.warn("DB_PASSWORD is empty. Check .env value.");
}

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
