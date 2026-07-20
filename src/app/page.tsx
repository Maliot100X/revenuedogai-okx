export default function Home() {
  return (
    <div style={{minHeight:"100vh",background:"#0a0a1a",color:"#e4e4ef",fontFamily:"system-ui,sans-serif",padding:"40px 20px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <h1 style={{fontSize:42,fontWeight:800,background:"linear-gradient(135deg,#FFD700,#FF6B00)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8}}>
          RevenueDogAi
        </h1>
        <p style={{fontSize:18,color:"#888",marginBottom:40}}>AI-Powered Web Research &amp; Browser Automation on OKX.AI</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20,marginBottom:40}}>
          {[
            {name:"Deep Web Research",desc:"Multi-site research with structured data extraction",price:"0.01 USDT/call"},
            {name:"Browser Automation",desc:"Form filling, data extraction, multi-step workflows",price:"0.01 USDT/call"},
            {name:"Site Change Monitor",desc:"Website change detection with timestamps",price:"0.01 USDT/call"}
          ].map((s,i)=>(
            <div key={i} style={{background:"#111",border:"1px solid #333",borderRadius:12,padding:24}}>
              <h3 style={{color:"#FFD700",fontSize:18,marginBottom:8}}>{s.name}</h3>
              <p style={{color:"#aaa",fontSize:14,marginBottom:12}}>{s.desc}</p>
              <span style={{background:"#FFD70022",color:"#FFD700",padding:"4px 12px",borderRadius:6,fontSize:13}}>{s.price}</span>
            </div>
          ))}
        </div>
        <div style={{background:"#111",border:"1px solid #333",borderRadius:12,padding:24}}>
          <h2 style={{color:"#FFD700",marginBottom:16}}>API Endpoint</h2>
          <code style={{display:"block",background:"#1a1a2e",padding:12,borderRadius:8,color:"#4ade80",fontSize:13,marginBottom:12}}>
            POST https://revenuedogai-okx.vercel.app/api/task
          </code>
          <p style={{color:"#888",fontSize:13}}>Agent ID: #6735 | Chain: X Layer | x402 Payment: 0.01 USDT</p>
        </div>
      </div>
    </div>
  );
}
