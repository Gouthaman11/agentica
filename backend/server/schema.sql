CREATE DATABASE IF NOT EXISTS bank_extractor;
USE bank_extractor;

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
);

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
);

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
);
