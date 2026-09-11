import { createFileRoute } from "@tanstack/react-router";
import { askAI, parseJson, type AiMessage } from "@/lib/ai.server";

type CandidateInput = { id: string; name: string; position: string; resumeText: string };

function errorResponse(error: unknown) {
  const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 500;
  const message = error instanceof Error ? error.message : "AI request failed";
  return Response.json({ error: message }, { status: Number.isFinite(status) ? status : 500 });
}

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            action?: string;
            role?: string;
            candidates?: CandidateInput[];
            messages?: AiMessage[];
            context?: string;
          };
          if (body.action === "rank") {
            if (!body.role || !body.candidates?.length) {
              return Response.json({ error: "A role and at least one resume are required" }, { status: 400 });
            }
            const raw = await askAI([
              {
                role: "system",
                content:
                  "You are an expert recruitment analyst. Evaluate only evidence present in each resume. Return only valid JSON: {\"results\":[{\"id\":string,\"score\":integer 0-100,\"summary\":string,\"strengths\":string[],\"gaps\":string[]}]}. Include every candidate exactly once.",
              },
              {
                role: "user",
                content: `Target role: ${body.role}\n\nCandidates:\n${body.candidates
                  .map((c) => `ID: ${c.id}\nName: ${c.name}\nResume:\n${c.resumeText.slice(0, 14000)}`)
                  .join("\n\n---\n\n")}`,
              },
            ]);
            const parsed = parseJson<{ results: { id: string; score: number; summary: string; strengths: string[]; gaps: string[] }[] }>(raw);
            if (!parsed?.results) throw new Error("AI ranking returned an invalid format");
            return Response.json(parsed);
          }
          if (body.action === "chat") {
            const history = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
            const answer = await askAI([
              {
                role: "system",
                content:
                  "You are the AI-HRM assistant. Help HR teams with recruiting, interviews, onboarding, employee letters, policy wording, and concise people-operations guidance. Use markdown. Never claim an email was sent or a record was changed unless the user confirms it. " +
                  (body.context ?? ""),
              },
              ...history.filter((message) => message.role !== "system"),
            ]);
            return Response.json({ answer });
          }
          return Response.json({ error: "Unknown AI action" }, { status: 400 });
        } catch (error) {
          return errorResponse(error);
        }
      },
    },
  },
});