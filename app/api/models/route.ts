import { NextResponse } from "next/server";

const MODELS_URL = `${process.env.OPENROUTER_API_BASE_URL || "https://ai.hackclub.com/proxy/v1"}/models`;

export async function GET() {
  const apiKey = process.env.HACKCLUB_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing HACKCLUB_API_KEY or OPENAI_API_KEY" },
      { status: 500 },
    );
  }

  const response = await fetch(MODELS_URL, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    const details = await response.text();
    return NextResponse.json(
      { error: "Failed to fetch models", status: response.status, details },
      { status: response.status },
    );
  }

  const body = await response.json();
  return NextResponse.json(body);
}
