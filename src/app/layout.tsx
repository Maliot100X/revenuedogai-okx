import type { Metadata } from "next";
export const metadata: Metadata = { title: "RevenueDogAi - OKX.AI Agent", description: "AI web research and browser automation" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body style={{margin:0,padding:0,background:"#0a0a1a"}}>{children}</body></html>);
}
