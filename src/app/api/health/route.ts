import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    status: "ok", agent: "RevenueDogAi", agentId: "6735",
    timestamp: new Date().toISOString(),
    services: ["Deep Web Research", "Browser Automation", "Site Change Monitor"],
    x402: "enabled", endpoint: "/api/task"
  });
}
