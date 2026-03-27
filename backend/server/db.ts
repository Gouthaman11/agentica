import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import { resolvePayeeName } from "./statement";

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

let schemaInitialized: Promise<void> | null = null;

async function columnExists(tableName: string, columnName: string) {
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    `
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?
      LIMIT 1
    `,
    [dbName, tableName, columnName],
  );

  return rows.length > 0;
}

async function getColumnType(tableName: string, columnName: string) {
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    `
      SELECT DATA_TYPE, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?
      LIMIT 1
    `,
    [dbName, tableName, columnName],
  );

  return rows[0] ?? null;
}

async function constraintExists(constraintName: string) {
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    `
      SELECT 1
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = ? AND CONSTRAINT_NAME = ?
      LIMIT 1
    `,
    [dbName, constraintName],
  );

  return rows.length > 0;
}

async function addColumnIfMissing(tableName: string, columnName: string, definition: string) {
  if (!(await columnExists(tableName, columnName))) {
    await db.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

async function modifyColumnIfNeeded(tableName: string, columnName: string, expectedDataTypes: string[], definition: string) {
  const column = await getColumnType(tableName, columnName);
  if (!column) {
    return;
  }

  const dataType = String(column.DATA_TYPE || "").toLowerCase();
  if (!expectedDataTypes.includes(dataType)) {
    await db.query(`ALTER TABLE ${tableName} MODIFY COLUMN ${columnName} ${definition}`);
  }
}

async function addIndexIfMissing(tableName: string, indexName: string, definition: string) {
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    `
      SELECT 1
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?
      LIMIT 1
    `,
    [dbName, tableName, indexName],
  );

  if (rows.length === 0) {
    await db.query(`ALTER TABLE ${tableName} ADD ${definition}`);
  }
}

async function initializeSchema() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      username VARCHAR(80) NOT NULL UNIQUE,
      email VARCHAR(190) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(25) NOT NULL,
      currency VARCHAR(8) NOT NULL,
      profile_picture_url VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id INT NOT NULL AUTO_INCREMENT,
      user_id VARCHAR(190) NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      file_type VARCHAR(120) NOT NULL,
      file_size BIGINT NOT NULL DEFAULT 0,
      s3_key VARCHAR(500) NOT NULL,
      public_url VARCHAR(1000) NOT NULL,
      extraction_status ENUM('uploaded', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'uploaded',
      extraction_error TEXT DEFAULT NULL,
      statement_start_date DATE DEFAULT NULL,
      statement_end_date DATE DEFAULT NULL,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_documents_user_id (user_id),
      KEY idx_documents_status (extraction_status)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INT NOT NULL AUTO_INCREMENT,
      document_id INT NOT NULL,
      user_id VARCHAR(190) NOT NULL,
      transaction_date DATE NOT NULL,
      posted_date DATE DEFAULT NULL,
      description VARCHAR(500) NOT NULL,
      payee VARCHAR(190) NOT NULL,
      reference_text VARCHAR(255) DEFAULT NULL,
      category VARCHAR(120) NOT NULL,
      direction ENUM('credit', 'debit') NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      balance DECIMAL(15,2) DEFAULT NULL,
      currency_code VARCHAR(12) NOT NULL DEFAULT 'INR',
      extraction_confidence DECIMAL(5,2) NOT NULL DEFAULT 0,
      raw_row_json JSON DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_transactions_user_id (user_id),
      KEY idx_transactions_document_id (document_id),
      KEY idx_transactions_date (transaction_date),
      CONSTRAINT fk_transactions_document
        FOREIGN KEY (document_id) REFERENCES documents(id)
        ON DELETE CASCADE
    )
  `);

  await addColumnIfMissing("documents", "user_id", "VARCHAR(190) NOT NULL DEFAULT 'guest' AFTER id");
  await addColumnIfMissing("documents", "file_name", "VARCHAR(255) NOT NULL DEFAULT 'Unknown.pdf' AFTER user_id");
  await addColumnIfMissing("documents", "file_type", "VARCHAR(120) NOT NULL DEFAULT 'application/pdf' AFTER file_name");
  await addColumnIfMissing("documents", "file_size", "BIGINT NOT NULL DEFAULT 0 AFTER file_type");
  await addColumnIfMissing("documents", "s3_key", "VARCHAR(500) NOT NULL DEFAULT '' AFTER file_size");
  await addColumnIfMissing("documents", "public_url", "VARCHAR(1000) NOT NULL DEFAULT '' AFTER s3_key");
  await addColumnIfMissing("documents", "extraction_status", "ENUM('uploaded', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'uploaded' AFTER public_url");
  await addColumnIfMissing("documents", "extraction_error", "TEXT NULL AFTER extraction_status");
  await addColumnIfMissing("documents", "statement_start_date", "DATE NULL AFTER extraction_error");
  await addColumnIfMissing("documents", "statement_end_date", "DATE NULL AFTER statement_start_date");
  await addColumnIfMissing("documents", "uploaded_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER statement_end_date");
  await addColumnIfMissing("documents", "updated_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER uploaded_at");
  await modifyColumnIfNeeded("documents", "user_id", ["varchar", "text", "char"], "VARCHAR(190) NOT NULL");
  await addIndexIfMissing("documents", "idx_documents_user_id", "INDEX idx_documents_user_id (user_id)");
  await addIndexIfMissing("documents", "idx_documents_status", "INDEX idx_documents_status (extraction_status)");

  await addColumnIfMissing("transactions", "document_id", "INT NOT NULL DEFAULT 0 AFTER id");
  await addColumnIfMissing("transactions", "user_id", "VARCHAR(190) NOT NULL DEFAULT 'guest' AFTER document_id");
  await addColumnIfMissing("transactions", "transaction_date", "DATE NULL AFTER user_id");
  await addColumnIfMissing("transactions", "posted_date", "DATE NULL AFTER transaction_date");
  await addColumnIfMissing("transactions", "description", "VARCHAR(500) NOT NULL DEFAULT '' AFTER posted_date");
  await addColumnIfMissing("transactions", "payee", "VARCHAR(190) NOT NULL DEFAULT 'Unknown Payee' AFTER description");
  await addColumnIfMissing("transactions", "reference_text", "VARCHAR(255) NULL AFTER payee");
  await addColumnIfMissing("transactions", "category", "VARCHAR(120) NOT NULL DEFAULT 'Other' AFTER reference_text");
  await addColumnIfMissing("transactions", "direction", "ENUM('credit', 'debit') NOT NULL DEFAULT 'debit' AFTER category");
  await addColumnIfMissing("transactions", "amount", "DECIMAL(15,2) NOT NULL DEFAULT 0 AFTER direction");
  await addColumnIfMissing("transactions", "balance", "DECIMAL(15,2) NULL AFTER amount");
  await addColumnIfMissing("transactions", "currency_code", "VARCHAR(12) NOT NULL DEFAULT 'INR' AFTER balance");
  await addColumnIfMissing("transactions", "extraction_confidence", "DECIMAL(5,2) NOT NULL DEFAULT 0 AFTER currency_code");
  await addColumnIfMissing("transactions", "raw_row_json", "JSON NULL AFTER extraction_confidence");
  await addColumnIfMissing("transactions", "created_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER raw_row_json");
  await modifyColumnIfNeeded("transactions", "user_id", ["varchar", "text", "char"], "VARCHAR(190) NOT NULL");
  await addIndexIfMissing("transactions", "idx_transactions_user_id", "INDEX idx_transactions_user_id (user_id)");
  await addIndexIfMissing("transactions", "idx_transactions_document_id", "INDEX idx_transactions_document_id (document_id)");
  await addIndexIfMissing("transactions", "idx_transactions_date", "INDEX idx_transactions_date (transaction_date)");

  if (await columnExists("transactions", "payee")) {
    await db.query(`
      UPDATE transactions
      SET payee = 'Unknown Payee'
      WHERE payee IS NULL OR TRIM(payee) = ''
    `);

    const [rows] = await db.query<mysql.RowDataPacket[]>(
      `
        SELECT id, payee, description
        FROM transactions
        WHERE payee = 'Unknown Payee' OR payee IS NULL OR TRIM(payee) = ''
      `,
    );

    for (const row of rows) {
      const resolvedPayee = resolvePayeeName(String(row.payee ?? ""), String(row.description ?? ""));
      if (!resolvedPayee || /^unknown payee$/i.test(resolvedPayee)) {
        continue;
      }

      await db.query(
        `
          UPDATE transactions
          SET payee = ?
          WHERE id = ?
        `,
        [resolvedPayee, row.id],
      );
    }
  }

  if (await columnExists("transactions", "transaction_date")) {
    await db.query(`
      UPDATE transactions
      SET transaction_date = COALESCE(transaction_date, CURDATE())
      WHERE transaction_date IS NULL
    `);

    await db.query(`
      ALTER TABLE transactions
      MODIFY COLUMN transaction_date DATE NOT NULL
    `);
  }

  if (!(await constraintExists("fk_transactions_document"))) {
    const [orphanRows] = await db.query<mysql.RowDataPacket[]>(
      `
        SELECT COUNT(*) AS total
        FROM transactions t
        LEFT JOIN documents d ON d.id = t.document_id
        WHERE t.document_id = 0 OR d.id IS NULL
      `,
    );

    if (Number(orphanRows[0]?.total ?? 0) === 0) {
      await db.query(`
        ALTER TABLE transactions
        ADD CONSTRAINT fk_transactions_document
        FOREIGN KEY (document_id) REFERENCES documents(id)
        ON DELETE CASCADE
      `);
    }
  }
}

export async function ensureSchema() {
  if (!schemaInitialized) {
    schemaInitialized = initializeSchema().catch((err) => {
      schemaInitialized = null;
      throw err;
    });
  }

  await schemaInitialized;
}

export async function checkDbConnection() {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    await ensureSchema();
    console.log("MySQL connected");
  } catch (error) {
    console.error("DB connection failed:", error);
  }
}
