import { createOpenAI } from "@ai-sdk/openai";

const openRouterBaseUrl = (
  process.env.OPENROUTER_API_BASE_URL ?? "https://openrouter.ai/api/v1"
).replace(/\/$/, "");

const openRouter = createOpenAI({
  baseURL: openRouterBaseUrl,
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  name: "openrouter",
});

export async function GET() {
  const response = await fetch(`${openRouterBaseUrl}/models`, {
    headers: {
      Authorization: `Bearer ${openRouter.apiKey}`,
    },
    cache: "no-store",
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
