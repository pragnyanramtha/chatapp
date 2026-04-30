const openRouterBaseUrl = (
	process.env.OPENROUTER_API_BASE_URL ?? "https://openrouter.ai/api/v1"
).replace(/\/$/, "");

export async function GET() {
	const response = await fetch(`${openRouterBaseUrl}/models`, {
		headers: {
			Authorization: `Bearer ${process.env.OPENROUTER_API_KEY ?? ""}`,
		},
		cache: "no-store",
	});

	return new Response(await response.text(), {
		status: response.status,
		headers: {
			"Content-Type":
				response.headers.get("content-type") ?? "application/json",
		},
	});
}
