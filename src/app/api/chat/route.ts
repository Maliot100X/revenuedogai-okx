import { NextRequest, NextResponse } from "next/server";

const BASE_URL = (process.env.FREEMODEL_BASE_URL || "https://api.freemodel.dev/v1").replace(/\/$/, "");
const MODEL = process.env.FREEMODEL_MODEL || "gpt-5.4";
const API_KEY = process.env.FREEMODEL_API_KEY || "";
const RETRIES = 3;

export async function GET() {
  return NextResponse.json({ status: "ok", service: "RevenueDogAi chat", model: MODEL, provider: BASE_URL });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const incoming = Array.isArray(body.messages) ? body.messages : [];
    if (!message && incoming.length === 0) return NextResponse.json({ error: "message or messages required" }, { status: 400 });
    if (!API_KEY) return NextResponse.json({ error: "chat provider is not configured" }, { status: 503 });
    const messages = incoming.length ? incoming : [{ role: "user", content: message }];
    let lastError = "model request failed";
    for (let attempt = 1; attempt <= RETRIES; attempt++) {
      try {
        const response = await fetch(`${BASE_URL}/chat/completions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: MODEL, messages, max_tokens: 1200, temperature: 0.2 }),
          signal: AbortSignal.timeout(90000),
          cache: "no-store",
        });
        const text = await response.text();
        let data: any;
        try { data = JSON.parse(text); }
        catch { throw new Error(`provider returned non-JSON response (${response.status})`); }
        if (!response.ok) throw new Error(data?.error?.message || `provider returned HTTP ${response.status}`);
        const content = data?.choices?.[0]?.message?.content;
        if (typeof content !== "string" || !content.trim()) throw new Error("model returned no content");
        return NextResponse.json({ content, model: data.model || MODEL, id: data.id || null, attempt });
      } catch (error) {
        lastError = error instanceof Error ? error.message : "model request failed";
        if (attempt < RETRIES) await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }
    return NextResponse.json({ error: lastError }, { status: 502 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "chat request failed" }, { status: 502 });
  }
}
