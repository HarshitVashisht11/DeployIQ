import { deploymentSchema } from "../models/deployment.schema.js";
import { PrismaClient } from "@prisma/client";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import crypto from "crypto";

const prisma = new PrismaClient();

// Create an AWS Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Define a token cost mapping per model (cost per token unit)
const tokenCostMap = {
  "anthropic.claude-3-haiku-20240307-v1:0": 2, // e.g., each token costs 2 credits
  "meta.llama3-70b-instruct-v1:0": 1,           // each token costs 1 credit
};

const deployModel = async (req, res) => {
  try {
    const parsed = deploymentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const { modelName } = parsed.data;
    const userId = req.user.userId;
    
    // Generate a unique API key for the user
    const apiKey = crypto.randomBytes(32).toString("hex");
    const apiUrl = `${process.env.API_BASE_URL}/api/deploy/invoke/${userId}/${modelName}`;
    
    // Save the API key and model info in the database
    const deployment = await prisma.deployment.create({
      data: {
        modelName,
        userId,
        apiKey,
        apiUrl,
        status: "deployed",
      },
    });
    
    res.status(200).json({ message: "Model deployed successfully", apiKey, apiUrl });
  } catch (error) {
    console.error("Deployment error:", error);
    res.status(500).json({ error: error.message });
  }
};

const invokeModel = async (req, res) => {
  try {
    const { userId, modelName } = req.params;
    // Accept additional options for a more professional API call
    const { input, maxTokens, temperature } = req.body;
    
    // Convert userId from string to integer (if needed)
    const parsedUserId = parseInt(userId, 10);
    
    // Validate API key by querying the deployment record
    const deployment = await prisma.deployment.findFirst({
      where: { 
        userId: parsedUserId, 
        modelName 
      },
    });
    if (!deployment || req.headers["x-api-key"] !== deployment.apiKey) {
      return res.status(403).json({ error: "Invalid API key" });
    }
    
    // Fetch user record to check available credits/tokens
    const user = await prisma.user.findUnique({ where: { id: parsedUserId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Determine the number of tokens requested (default to 50 if not provided)
    const tokensRequested = maxTokens || 50;
    const costPerToken = tokenCostMap[modelName] || 1;
    const totalCost = tokensRequested * costPerToken;
    
    // Check if the user has enough credits
    if (user.credits < totalCost) {
      return res.status(402).json({ error: "Insufficient tokens/credits" });
    }
    
    // Deduct credits from the user's balance
    await prisma.user.update({
      where: { id: parsedUserId },
      data: { credits: { decrement: totalCost } },
    });
    
    // Build the payload for AWS Bedrock including optional parameters
    const payload = { prompt: input };
    if (maxTokens) payload.max_gen_length = maxTokens;
    if (temperature) payload.temperature = temperature;
    
    // Invoke the model using AWS Bedrock
    const command = new InvokeModelCommand({
      modelId: modelName,
      body: JSON.stringify(payload),
      contentType: "application/json",
    });
    const response = await bedrockClient.send(command);
    
    const output = JSON.parse(new TextDecoder().decode(response.body));
    res.status(200).json({ output });
  } catch (error) {
    console.error("Model invocation error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getDeploymentOptions = async (req, res) => {
  try {
    const options = {
      models: [
        "anthropic.claude-3-haiku-20240307-v1:0",
        "meta.llama3-70b-instruct-v1:0"
      ],
      regions: ["ap-south-1", "us-west-1"],
    };
    res.status(200).json(options);
  } catch (error) {
    console.error("Options error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getDeployedModels = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch all deployments for the user
    const deployments = await prisma.deployment.findMany({
      where: {
        userId: userId
      }
    });

    // Transform the deployments data to match the frontend expectations
    const transformedDeployments = deployments.map(deployment => ({
      id: deployment.id.toString(),
      modelName: deployment.modelName,
      apiKey: deployment.apiKey,
      apiUrl: deployment.apiUrl,
      status: deployment.status,
      deployedAt: deployment.createdAt.toISOString(),
    }));

    res.status(200).json(transformedDeployments);
  } catch (error) {
    console.error("Error fetching deployed models:", error);
    res.status(500).json({ error: "Failed to fetch deployed models" });
  }
};
export default { deployModel, invokeModel, getDeploymentOptions ,getDeployedModels};
