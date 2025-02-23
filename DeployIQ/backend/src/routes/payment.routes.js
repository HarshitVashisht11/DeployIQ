// routes/payment.routes.js
import { Router } from "express";
const router = Router();
import paymentController from "../controllers/payment.controller.js";
import pkg from "jsonwebtoken";
const { verify } = pkg;

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  verify(token, process.env.JWT_SECRET, (err, userData) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = userData;
    next();
  });
};

// Route to create a checkout session for buying credits
router.post("/buy", authenticateToken, paymentController.createCheckoutSession);

export default router;
