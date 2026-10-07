import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI HR Assistant | AI-HRM" },
      { name: "description", content: "Ask the AI HR assistant about hiring, interviews, offer letters and HR policy." },
      { property: "og:title", content: "AI HR Assistant | AI-HRM" },
      { property: "og:description", content: "Your AI helper for hiring and HR questions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Ask me anything about hiring, interviews, letters or HR policy." },
  ]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!text.trim() || busy) return;
    const next = [...msgs, { role: "user" as const, content: text.trim() }];
    setMsgs(next);
    setText("");
    setBusy(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "chat", messages: next }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Assistant unavailable");
      setMsgs([...next, { role: "assistant", content: data.answer ?? "" }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Assistant unavailable");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
          <Bot className="h-6 w-6 text-primary" /> AI HR assistant
        </h1>
        <div className="mt-6 h-[60vh] space-y-3 overflow-y-auto rounded-xl border border-border bg-card p-4">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
              <p className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                {m.content}
              </p>
            </div>
          ))}
          {busy ? <p className="text-xs text-muted-foreground">Thinking…</p> : null}
        </div>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); void send(); }}>
          <Input value={text} maxLength={2000} onChange={(e) => setText(e.target.value)} placeholder="Type your question" />
          <Button type="submit" disabled={busy}><Send className="h-4 w-4" /></Button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
