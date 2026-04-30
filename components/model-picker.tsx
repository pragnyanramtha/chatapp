"use client";

import * as React from "react";
import { useModelStore } from "@/lib/model-store";

type OpenRouterModel = {
	id: string;
	name?: string;
};

type OpenRouterModelsResponse = {
	data: OpenRouterModel[];
};

function providerFromModelId(modelId: string) {
	return modelId.split("/")[0] ?? "";
}

function providerLogo(provider: string) {
	// Minimal logo set without introducing new deps/assets.
	// Falls back to a text avatar.
	switch (provider.toLowerCase()) {
		case "openai":
			return "OA";
		case "anthropic":
			return "A";
		case "google":
			return "G";
		case "meta-llama":
		case "meta":
			return "M";
		case "mistralai":
			return "Mi";
		case "cohere":
			return "C";
		case "deepseek":
			return "D";
		default:
			return provider.slice(0, 2).toUpperCase();
	}
}

export function ModelPicker() {
	const { model, setModel } = useModelStore();
	const [models, setModels] = React.useState<OpenRouterModel[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				setLoading(true);
				setError(null);
				const res = await fetch("/api/models", { cache: "no-store" });
				if (!res.ok) {
					throw new Error(`Failed to load models (${res.status})`);
				}
				const json = (await res.json()) as OpenRouterModelsResponse;
				const list = Array.isArray(json.data) ? json.data : [];

				if (!cancelled) {
					setModels(list);
					if (!list.some((m) => m.id === model) && list[0]?.id) {
						setModel(list[0].id);
					}
				}
			} catch (e) {
				if (!cancelled) {
					setError(e instanceof Error ? e.message : "Failed to load models");
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		void load();
		return () => {
			cancelled = true;
		};
	}, [model, setModel]);

	return (
		<div className="mx-auto flex w-full max-w-3xl items-center gap-3">
			<div className="min-w-0 flex-1">
				<div className="text-xs font-medium text-muted-foreground">Model</div>
				<div className="mt-1 flex items-center gap-2">
					<span className="inline-flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px] font-semibold">
						{providerLogo(providerFromModelId(model))}
					</span>
					<select
						className="h-9 w-full rounded-md border bg-background px-3 text-sm"
						value={model}
						onChange={(e) => setModel(e.target.value)}
						disabled={loading || models.length === 0}
					>
						{models.map((m) => (
							<option key={m.id} value={m.id}>
								{m.name ? `${m.name} (${m.id})` : m.id}
							</option>
						))}
					</select>
				</div>
				{error ? (
					<div className="mt-1 text-xs text-destructive">{error}</div>
				) : loading ? (
					<div className="mt-1 text-xs text-muted-foreground">
						Loading models…
					</div>
				) : null}
			</div>
		</div>
	);
}
