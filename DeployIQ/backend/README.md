# API Documentation

## Table of Contents
- [Authentication Routes](#authentication-routes)
- [Deployment Routes](#deployment-routes)
- [Payment Routes](#payment-routes)
- [Application Setup](#application-setup)

## Authentication Routes

Base path: `/api/auth`

### Purpose
Handles user authentication by providing signup and login functionality. Successful authentication returns a JWT token required for accessing protected endpoints.

### Routes

#### Sign Up
```http
POST /api/auth/signup
```

Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

**Response:**
```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
```

Authenticates an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

**Response:**
```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Implementation

```javascript
import { Router } from "express";
const router = Router();
import authController from "../controllers/auth.controller.js";
const { signup, login } = authController;

router.post("/signup", signup);
router.post("/login", login);

export default router;
```

## Deployment Routes

Base path: `/api/deploy`

### Purpose
Manages model deployments on AWS Bedrock, handles model invocation, and provides deployment options.

### Routes

#### Deploy Model
```http
POST /api/deploy/
```

Deploys a new model instance.

**Authentication:** Requires JWT token in Authorization header (`Bearer <JWT_TOKEN>`)

**Request Body:**
```json
{
  "modelName": "meta.llama3-70b-instruct-v1:0"
}
```

**Response:**
```json
{
  "message": "Model deployed successfully",
  "apiKey": "<generated_api_key>",
  "apiUrl": "http://localhost:3000/api/deploy/invoke/1/meta.llama3-70b-instruct-v1:0"
}
```

#### Invoke Model
```http
POST /api/deploy/invoke/:userId/:modelName
```

Invokes a deployed model.

**Authentication:** Requires API key in header (`x-api-key`)

**Route Parameters:**
- `userId`: User identifier
- `modelName`: Name of the model to invoke

**Request Body:**
```json
{
  "input": "Tell a joke about programming",
  "maxTokens": 100,
  "temperature": 0.7
}
```

**Response:**
```json
{
  "output": "Here is your generated joke: ..."
}
```

#### Get Deployment Options
```http
GET /api/deploy/options
```

Retrieves available models and regions.

**Response:**
```json
{
  "models": [
    "anthropic.claude-3-haiku-20240307-v1:0",
    "meta.llama3-70b-instruct-v1:0"
  ],
  "regions": ["ap-south-1", "us-west-1"]
}
```

### Implementation

```javascript
import { Router } from "express";
const router = Router();
import deploymentController from "../controllers/deployment.controller.js";
import pkg from 'jsonwebtoken';
const { verify } = pkg;

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

router.post("/", authenticateToken, deploymentController.deployModel);
router.post("/invoke/:userId/:modelName", deploymentController.invokeModel);
router.get("/options", deploymentController.getDeploymentOptions);

export default router;
```

## Payment Routes

Base path: `/api/payment`

### Purpose
Handles credit purchases using Stripe integration. Credits are used for model invocation with a conversion rate of 1 USD = 100 credits.

### Routes

#### Purchase Credits
```http
POST /api/payment/buy
```

Creates a Stripe Checkout Session for credit purchase.

**Authentication:** Requires JWT token in Authorization header

**Request Body:**
```json
{
  "creditsToBuy": 500
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_a1b2c3..."
}
```

### Implementation

```javascript
import { Router } from "express";
const router = Router();
import paymentController from "../controllers/payment.controller.js";
import pkg from "jsonwebtoken";
const { verify } = pkg;

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

router.post("/buy", authenticateToken, paymentController.createCheckoutSession);

export default router;
```

#### Stripe Integration Controller

```javascript
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });
const prisma = new PrismaClient();

const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { creditsToBuy } = req.body;

    if (!creditsToBuy || creditsToBuy <= 0) {
      return res.status(400).json({ error: "Invalid credit quantity" });
    }

    const amount = creditsToBuy;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${creditsToBuy} Credits`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.API_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.API_BASE_URL}/payment/cancel`,
      metadata: {
        userId: userId.toString(),
        creditsToBuy: creditsToBuy.toString(),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating Checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

export default { createCheckoutSession };
```

## Application Setup

### Main Application Configuration

```javascript
import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import deploymentRoutes from "./routes/deployment.routes.js";

const app = express();

app.use(cors());
app.use(json());

app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/deploy", deploymentRoutes);

export default app;
```

## Quick Reference for Frontend Developers

### Authentication
- Sign up and login routes provide JWT tokens for authentication
- All protected routes require JWT token in Authorization header

### Deployment
- Deploy models using JWT authentication
- Invoke models using API key authentication
- Check available models and regions through options endpoint

### Payments
- Purchase credits using Stripe Checkout
- Credit conversion: 1 USD = 100 credits
- Stripe success/cancel URLs handle payment completion