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
  baseURL: process.env.OPENROUTER_API_BASE_URL || "https://ai.hackclub.com/proxy/v1",
});

const EXA_BASE = `${process.env.PRAGNYAN_API_BASE_URL || "https://ai.hackclub.com/proxy/v1"}/exa`;
const apiKey = process.env.HACKCLUB_API_KEY || process.env.OPENAI_API_KEY;

const exaHeaders = {
  "Authorization": `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

const exaSearch = tool({
  description:
    "Search the web for real-time information using Exa. For Q&A/weather/current events, use operation: 'answer' directly (no separate search needed). Use 'search' for raw result links, 'findSimilar' for pages similar to a URL.",
  inputSchema: z.object({
    query: z.string().optional().describe("Search query/question (not needed for findSimilar)"),
    operation: z.enum(["search", "findSimilar", "answer"]).describe("Operation type: 'search' for web search, 'findSimilar' for pages similar to a URL, 'answer' for grounded Q&A"),
    url: z.string().optional().describe("URL to find similar pages (required for findSimilar operation)"),
    numResults: z.number().min(1).max(10).optional().describe("Number of results (default 5)"),
    livecrawl: z.enum(["fallback", "preferred"]).optional().describe("Live crawl mode for fresh content"),
    stream: z.boolean().optional().describe("Enable streaming for answer operation"),
  }).refine(
    (data) => {
      if (data.operation === "findSimilar") return !!data.url;
      return !!data.query;
    },
    { message: "query is required for search/answer; url is required for findSimilar" }
  ),
  execute: async ({ query, operation, url, numResults, livecrawl, stream }) => {
    const endpoint = operation === "findSimilar" ? "findSimilar" : operation === "answer" ? "answer" : "search";
    const body: Record<string, unknown> = {};
    
    if (operation === "findSimilar") {
      if (url) body.url = url;
    } else {
      if (query) body.query = query;
    }
    if (numResults) body.numResults = numResults;
    if (livecrawl) body.livecrawl = livecrawl;
    if (stream && operation === "answer") body.stream = stream;

    const res = await fetch(`${EXA_BASE}/${endpoint}`, {
      method: "POST",
      headers: exaHeaders,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Exa ${endpoint} failed: ${res.status}`);
    return await res.json();
  },
});

const webFetch = tool({
  description:
    "Extract and read content from a specific URL using Exa. Use this when you need to read or analyze the content of a particular webpage, PDF, or document. Supports markdown, text, or HTML formats.",
  inputSchema: z.object({
    url: z.string().describe("The URL to extract content from"),
    format: z.enum(["markdown", "text", "html"]).optional().describe("Output format (default: markdown)"),
    timeout: z.number().optional().describe("Timeout in seconds (max 120)"),
  }),
  execute: async ({ url, format, timeout }) => {
    const res = await fetch(`${EXA_BASE}/contents`, {
      method: "POST",
      headers: exaHeaders,
      body: JSON.stringify({
        urls: [url],
        ...(format && { format }),
        ...(timeout && { timeout }),
      }),
    });
    if (!res.ok) throw new Error(`Exa contents failed: ${res.status}`);
    return await res.json();
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
    model: hackclubAI.chat("z-ai/glm-5.1"),
    messages: await convertToModelMessages(injectQuoteContext(messages)),
    system,
    tools: {
      ...frontendTools(tools ?? {}),
      exa_search: exaSearch,
      web_fetch: webFetch,
    },
    // Enable reasoning for OpenRouter - sends reasoning parameter in request body
    providerOptions: {
      openai: {
        reasoning: { enabled: true },
      },
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
