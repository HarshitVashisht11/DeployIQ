import authSchemas from "../models/auth.schema.js";
const { signupSchema, loginSchema } = authSchemas;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { genSalt, hash, compare } from "bcryptjs";
import pkg from "jsonwebtoken";
const { sign } = pkg;

const signup = async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const { email, password } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    // Generate JWT token
    const token = sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const { email, password } = parsed.data;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Verify password
    const valid = await compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { signup, login };
