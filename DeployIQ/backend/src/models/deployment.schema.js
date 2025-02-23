import { z } from "zod";

export const deploymentSchema = z.object({
  modelName: z.enum(["anthropic.claude-3-haiku-20240307-v1:0", "meta.llama3-70b-instruct-v1:0"]),
});
