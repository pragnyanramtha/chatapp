import { createOpenAI } from "@ai-sdk/openai";
import { frontendTools, injectQuoteContext } from "@assistant-ui/react-ai-sdk";
import {
  type JSONSchema7,
  streamText,
  convertToModelMessages,
  type UIMessage,
  tool,
} from "ai";
import { z } from "zod";

const hackclubAI = createOpenAI({
  apiKey: process.env.HACKCLUB_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: "https://ai.hackclub.com/proxy/v1",
});

const EXA_BASE = "https://ai.hackclub.com/proxy/v1/exa";
const apiKey = process.env.HACKCLUB_API_KEY || process.env.OPENAI_API_KEY;

const exaHeaders = {
  "Authorization": `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

const exaSearch = tool({
  description:
    "Search the web for real-time information using Exa. Use this when asked about current events, recent news, or anything that may require up-to-date information.",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    numResults: z.number().min(1).max(10).describe("Number of results to return"),
  }),
  execute: async ({ query, numResults }): Promise<Array<{ title: string; url: string; publishedDate?: string }>> => {
    const res = await fetch(`${EXA_BASE}/search`, {
      method: "POST",
      headers: exaHeaders,
      body: JSON.stringify({ query, numResults: numResults || 5 }),
    });
    if (!res.ok) throw new Error(`Exa search failed: ${res.status}`);
    const data = await res.json();
    return data.results.map((r: { title: string; url: string; publishedDate?: string }) => ({
      title: r.title,
      url: r.url,
      publishedDate: r.publishedDate,
    }));
  },
});

export async function POST(req: Request) {
  const {
    messages,
    system,
    tools,
  }: {
    messages: UIMessage[];
    system?: string;
    tools?: Record<string, { description?: string; parameters: JSONSchema7 }>;
  } = await req.json();

  const result = streamText({
    // Use chat-completions mode for this proxy to avoid invalid Responses API payload errors.
    model: hackclubAI.chat("gpt-4o-mini"),
    messages: await convertToModelMessages(injectQuoteContext(messages)),
    system,
    tools: {
      ...frontendTools(tools ?? {}),
      exa_search: exaSearch,
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    messageMetadata: ({ part }) => {
      if (part.type === "finish") {
        return {
          usage: part.totalUsage,
        };
      }
      if (part.type === "finish-step") {
        return {
          modelId: part.response.modelId,
        };
      }
      return undefined;
    },
  });
}
