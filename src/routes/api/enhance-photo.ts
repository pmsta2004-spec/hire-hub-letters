import { createFileRoute } from "@tanstack/react-router";

function extractImage(text: string): string | null {
  const dataUrl = text.match(/data:image\/[a-zA-Z+]+;base64,[A-Za-z0-9+/=]+/);
  if (dataUrl) return dataUrl[0];
  const b64 = text.match(/"b64_json"\s*:\s*"([A-Za-z0-9+/=]+)"/);
  if (b64?.[1]) return `data:image/png;base64,${b64[1]}`;
  return null;
}

export const Route = createFileRoute("/api/enhance-photo")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { image, prompt } = (await request.json()) as { image?: string; prompt?: string };
        if (!image) return new Response("Missing image", { status: 400 });
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const instruction =
          prompt ||
          "Turn this photo into a clean professional employee ID card portrait: head and shoulders, centered, sharp focus, neutral studio lighting, plain light grey background, natural skin tones, business attire look. Keep the person's face identical and unaltered.";

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-3-pro-image",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: instruction },
                  { type: "image_url", image_url: { url: image } },
                ],
              },
            ],
            modalities: ["image", "text"],
          }),
        });

        const text = await upstream.text();
        if (!upstream.ok) {
          console.error(`Photo enhance failed [${upstream.status}]: ${text}`);
          return new Response(text, { status: upstream.status });
        }
        const out = extractImage(text);
        if (!out) {
          console.error(`Photo enhance returned no image: ${text.slice(0, 500)}`);
          return new Response("No image returned", { status: 502 });
        }
        return new Response(JSON.stringify({ image: out }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
