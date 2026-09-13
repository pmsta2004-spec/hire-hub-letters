/** Client-side resume text extraction for PDF, Word and plain text files. */

async function pdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    parts.push(
      content.items
        .map((it) => ("str" in it ? it.str : ""))
        .join(" ")
        .replace(/\s+/g, " "),
    );
  }
  return parts.join("\n").trim();
}

async function docxText(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const buf = await file.arrayBuffer();
  const res = await mammoth.extractRawText({ arrayBuffer: buf });
  return res.value.trim();
}

export async function extractResumeText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return pdfText(file);
  if (name.endsWith(".docx") || name.endsWith(".doc")) return docxText(file);
  return (await file.text()).trim();
}

/** Best-effort contact details straight out of the resume text. */
export function guessContact(text: string, fileName: string) {
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.]{2,}/)?.[0] ?? "";
  const phone = text.match(/(\+?\d[\d\s-]{8,14}\d)/)?.[0]?.trim() ?? "";
  const firstLines = text
    .split(/\n|\r/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 6);
  const nameLine = firstLines.find(
    (l) => /^[A-Za-z][A-Za-z.'\- ]{3,40}$/.test(l) && l.split(" ").length <= 4,
  );
  const fallback = fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  return {
    name: (nameLine ?? fallback).slice(0, 60),
    email: email.slice(0, 120),
    phone: phone.slice(0, 20),
  };
}
