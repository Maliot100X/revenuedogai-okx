import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.BROWSER_USE_API_KEY || "";
const MODEL = process.env.BROWSER_USE_MODEL || "claude-sonnet-4.6";
const WALLET = process.env.X_LAYER_WALLET || "";
const AMOUNT = process.env.X402_AMOUNT || "10000";

function get402Challenge(url: string, desc: string) {
  return {
    x402Version: 2,
    resource: { url, description: desc, mimeType: "application/json" },
    accepts: [{
      scheme: "exact",
      network: "eip155:196",
      asset: "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      amount: AMOUNT,
      payTo: WALLET,
      maxTimeoutSeconds: 300,
      extra: { name: "USDt0", version: "1" }
    }]
  };
}

export async function POST(req: NextRequest) {
  const url = "https://revenuedogai-okx.vercel.app/api/task";
  try {
    const body = await req.json();
    const { task } = body;
    if (!task) return NextResponse.json({ error: "task required" }, { status: 400 });

    const payment = req.headers.get("x-payment");
    if (!payment) {
      const ch = get402Challenge(url, "RevenueDogAi - AI web research and browser automation");
      const encoded = btoa(JSON.stringify(ch));
      return NextResponse.json(
        { x402Version: 2, accepts: ch.accepts },
        { status: 402, headers: { "PAYMENT-REQUIRED": encoded } }
      );
    }

    const sr = await fetch("https://api.browser-use.com/api/v3/sessions", {
      method: "POST",
      headers: { "X-Browser-Use-API-Key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ task, model: MODEL })
    });
    const s = await sr.json();
    if (!s.id) return NextResponse.json({ status: "error", detail: s.detail || "failed" }, { status: 500 });

    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 5000));
      const pr = await fetch("https://api.browser-use.com/api/v3/sessions/" + s.id, {
        headers: { "X-Browser-Use-API-Key": API_KEY }
      });
      const p = await pr.json();
      if (["stopped", "idle", "error", "timed_out"].includes(p.status)) {
        return NextResponse.json({ status: p.status, output: p.output || null, steps: p.stepCount || 0 });
      }
    }
    return NextResponse.json({ error: "timeout" }, { status: 504 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", service: "RevenueDogAi", endpoint: "/api/task", x402: "enabled", agentId: "6735" });
}
