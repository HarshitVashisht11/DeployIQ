import { Router } from "express";
const router = Router();

import deploymentController from "../controllers/deployment.controller.js";
const { deployModel, invokeModel, getDeploymentOptions } = deploymentController;

import pkg from 'jsonwebtoken';
const { verify } = pkg;

// JWT authentication middleware for protected routes
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

// Deploy model using AWS Bedrock (protected endpoint)
router.post("/", authenticateToken, deployModel);

// Invoke deployed model (authentication via API key header 'x-api-key')
router.post("/invoke/:userId/:modelName", invokeModel);

// Get available deployment options (e.g., models and regions)
router.get("/options", getDeploymentOptions);

export default router;
