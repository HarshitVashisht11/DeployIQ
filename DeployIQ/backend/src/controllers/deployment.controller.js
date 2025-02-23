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
    const { input } = req.body;
    
    // Convert userId from string to integer
    const parsedUserId = parseInt(userId, 10);
    
    // Validate API key by querying the database with the correct userId type
    const deployment = await prisma.deployment.findFirst({
      where: { 
        userId: parsedUserId, 
        modelName 
      },
    });
    if (!deployment || req.headers["x-api-key"] !== deployment.apiKey) {
      return res.status(403).json({ error: "Invalid API key" });
    }
    
    // Invoke AWS Bedrock model as before
    const command = new InvokeModelCommand({
      modelId: modelName,
      body: JSON.stringify({ prompt: input }),
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
      models: ["anthropic.claude-3-haiku-20240307-v1:0", "meta.llama3-70b-instruct-v1:0"],
      regions: ["ap-south-1", "us-west-1"],
    };
    res.status(200).json(options);
  } catch (error) {
    console.error("Options error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { deployModel, invokeModel, getDeploymentOptions };
