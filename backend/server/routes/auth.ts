import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResultSetHeader, RowDataPacket } from "mysql2";

import { db } from "../db";

type SignupBody = {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  currency?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  currency: string;
}

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const { name, username, email, password, phone, currency } = req.body as SignupBody;

  if (!name || !username || !email || !password || !phone || !currency) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const [existing] = await db.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1",
      [email, username],
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email or username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query<ResultSetHeader>(
      `
        INSERT INTO users (name, username, email, password, phone, currency)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [name, username, email, hashedPassword, phone, currency],
    );

    return res.status(201).json({
      message: "User registered successfully.",
      userId: result.insertId,
    });
  } catch (error) {
    const message =
      error && typeof error === "object" && "sqlMessage" in error
        ? String((error as { sqlMessage?: string }).sqlMessage)
        : "Signup failed.";
    return res.status(500).json({ message });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as LoginBody;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const [rows] = await db.query<UserRow[]>("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET ?? "dev-secret-change-me",
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        currency: user.currency,
      },
    });
  } catch (error) {
    const message =
      error && typeof error === "object" && "sqlMessage" in error
        ? String((error as { sqlMessage?: string }).sqlMessage)
        : "Login failed.";
    return res.status(500).json({ message });
  }
});

export { authRouter };
