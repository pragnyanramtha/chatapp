"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
	AssistantChatTransport,
	useChatRuntime,
} from "@assistant-ui/react-ai-sdk";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { Thread } from "@/components/assistant-ui/thread";
import { ModelPicker } from "@/components/model-picker";
import { useModelStore } from "@/lib/model-store";

export const Assistant = () => {
	const model = useModelStore((s) => s.model);

	const runtime = useChatRuntime({
		sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
		transport: new AssistantChatTransport({
			api: "/api/chat",
			body: { model },
		}),
	});

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			<div className="h-dvh">
				<Thread />
				<div className="border-t bg-background p-3">
					<ModelPicker />
				</div>
			</div>
		</AssistantRuntimeProvider>
	);
};
