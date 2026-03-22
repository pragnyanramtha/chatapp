import { createOpenAI } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  type JSONSchema7,
  type UIMessage,
} from "ai";

const backendBaseUrl = (
  process.env.PRAGNYAN_API_BASE_URL ??
  "https://pragnyanramtha--pragnyan-clone-api-fastapi-app.modal.run"
).replace(/\/$/, "");

const modelId = process.env.PRAGNYAN_MODEL_ID ?? "pragnyan-clone-v1";

const pragnyan = createOpenAI({
  baseURL: `${backendBaseUrl}/v1`,
  apiKey: process.env.PRAGNYAN_API_KEY ?? "local-dev",
  name: "pragnyan",
});

export async function POST(req: Request) {
  const {
    messages,
    system,
  }: {
    messages: UIMessage[];
    system?: string;
    tools?: Record<string, { description?: string; parameters: JSONSchema7 }>;
  } = await req.json();

  const result = await generateText({
    model: pragnyan.chat(modelId),
    messages: await convertToModelMessages(messages),
    system,
    maxRetries: 1,
  });

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: ({ writer }) => {
      writer.write({ type: "start-step" });
      writer.write({ type: "text-start", id: "text-1" });
      writer.write({ type: "text-delta", id: "text-1", delta: result.text });
      writer.write({ type: "text-end", id: "text-1" });
      writer.write({ type: "finish-step" });
    },
  });

  return createUIMessageStreamResponse({ stream });
}
