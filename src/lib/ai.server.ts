export type AiMessage = { role: "system" | "user" | "assistant"; content: string };

export async function askAI(messages: AiMessage[]): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  const openaiKey = process.env["OPENAI_API_KEY"];
  if (!key && !openaiKey) throw new Error("AI key missing: add OPENAI_API_KEY in your hosting settings");

  const input = messages.map((m) => ({ role: m.role, content: m.content }));
  const res = key
    ? await fetch("https://ai.gateway.lovable.dev/v1/responses", {
        method: "POST",
        headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch", "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-6-astra",
          stream: true,
          store: false,
          reasoning: { effort: "low", summary: "auto" },
          include: ["reasoning.encrypted_content"],
          input,
        }),
      })
    : await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", stream: true, store: false, input }),
      });
  if (!res.ok) {
    const errorText = await res.text();
    throw Object.assign(new Error(errorText.slice(0, 400)), { status: res.status });
  }
  if (!res.body) throw new Error("AI response stream was empty");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let answer = "";
  let reasoning = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";
    for (const event of events) {
      const line = event.split("\n").find((part) => part.startsWith("data: "));
      if (!line || line === "data: [DONE]") continue;
      try {
        const data = JSON.parse(line.slice(6)) as { type?: string; delta?: string };
        if (data.type === "response.output_text.delta") answer += data.delta ?? "";
        if (data.type === "response.reasoning_summary_text.delta") reasoning += data.delta ?? "";
      } catch {
        // Ignore incomplete/non-JSON SSE events.
      }
    }
  }
  const output = answer.trim() || reasoning.trim();
  if (!output) throw new Error("AI returned an empty response");
  return output;
}

export function parseJson<T>(raw: string): T | null {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced?.[1] ?? raw;
  const start = body.search(/[[{]/);
  if (start < 0) return null;
  const end = Math.max(body.lastIndexOf("]"), body.lastIndexOf("}"));
  try {
    return JSON.parse(body.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}
