import { createOpenAI } from "@ai-sdk/openai";
import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	generateText,
	type JSONSchema7,
	type UIMessage,
} from "ai";

const openRouterBaseUrl = (
	process.env.OPENROUTER_API_BASE_URL ?? "https://openrouter.ai/api/v1"
).replace(/\/$/, "");

const openRouter = createOpenAI({
	baseURL: openRouterBaseUrl,
	apiKey: process.env.OPENROUTER_API_KEY ?? "",
	name: "openrouter",
});

export async function POST(req: Request) {
	const {
		messages,
		system,
		model,
	}: {
		messages: UIMessage[];
		system?: string;
		model?: string;
		tools?: Record<string, { description?: string; parameters: JSONSchema7 }>;
	} = await req.json();

	const modelId = model ?? "openai/gpt-4o-mini";

	const result = await generateText({
		model: openRouter.chat(modelId),
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
