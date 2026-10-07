import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addFeedback, listFeedback, type Feedback } from "@/lib/db";
import { formatDateTime } from "@/lib/letters";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback | AI-HRM" },
      { name: "description", content: "Share feedback on AI-HRM and see what others have said." },
      { property: "og:title", content: "Feedback | AI-HRM" },
      { property: "og:description", content: "Rate and review the AI-HRM hiring workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const [rows, setRows] = useState<Feedback[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void listFeedback().then(setRows).catch(() => undefined);
  }, []);

  async function submit() {
    if (!message.trim()) return toast.error("Please write a message");
    await addFeedback({ name, email, rating, message, aiReply: "" });
    setMessage("");
    setRows(await listFeedback());
    toast.success("Thank you for your feedback");
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold">Feedback</h1>
        <div className="mt-6 space-y-3 rounded-xl border border-border bg-card p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Your name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Email (optional)" maxLength={120} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" aria-label={`${n} stars`} onClick={() => setRating(n)}>
                <Star className={`h-6 w-6 ${n <= rating ? "fill-brand text-brand" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <Textarea rows={4} maxLength={1000} placeholder="What works well, what should improve?" value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button onClick={() => void submit()}>
            <Send className="mr-2 h-4 w-4" /> Submit
          </Button>
        </div>
        <div className="mt-8 space-y-3">
          {rows.map((f) => (
            <div key={f.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{f.name || "Anonymous"}</p>
                <span className="text-xs text-muted-foreground">{formatDateTime(f.createdAt)}</span>
              </div>
              <p className="text-brand">{"★".repeat(f.rating)}</p>
              <p className="mt-1 text-sm">{f.message}</p>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
