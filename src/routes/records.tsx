import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Download, Search } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { LetterDocument } from "@/components/LetterDocument";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  LETTER_TYPES,
  formatDate,
  type Letter,
} from "@/lib/letters";
import { deleteLetter, listLetters } from "@/lib/db";

export const Route = createFileRoute("/records")({
  head: () => ({
    meta: [
      { title: "Letter Records & Archive | AI-HRM" },
      {
        name: "description",
        content:
          "Browse every saved offer, joining and appointment letter by reference ID, edit details or download the PDF again.",
      },
      { property: "og:title", content: "Letter Records | AI-HRM" },
      {
        property: "og:description",
        content: "Searchable archive of all generated HR letters with edit and PDF download.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RecordsPage,
});

function typeLabel(t: Letter["type"]) {
  return LETTER_TYPES.find((x) => x.value === t)?.label ?? t;
}

function RecordsPage() {
  const [rows, setRows] = useState<Letter[]>([]);
  const [q, setQ] = useState("");
  const [printing, setPrinting] = useState<Letter | null>(null);

  useEffect(() => {
    void listLetters().then(setRows).catch(() => toast.error("Could not load records"));
  }, []);

  useEffect(() => {
    if (!printing) return;
    const t = setTimeout(() => {
      window.print();
      setPrinting(null);
    }, 300);
    return () => clearTimeout(t);
  }, [printing]);

  const filtered = rows.filter((r) =>
    `${r.name} ${r.letterId} ${r.position} ${typeLabel(r.type)}`.toLowerCase().includes(q.toLowerCase()),
  );

  async function remove(id: string) {
    await deleteLetter(id);
    setRows(await listLetters());
    toast.success("Record deleted");
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="no-print">
          <h1 className="font-display text-2xl font-bold">Letter records</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} letter{rows.length === 1 ? "" : "s"} saved in the cloud.
          </p>

          <div className="relative mt-5 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by name, ID or position"
              value={q}
              maxLength={60}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <p className="mt-6 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No records found.{" "}
              <Link to="/generate" className="text-primary underline">
                Generate a letter
              </Link>
              .
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <div className="min-w-[220px] flex-1">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.letterId} · {r.position} · {r.employmentType}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joining {formatDate(r.startDate)} · {r.location}
                    </p>
                  </div>
                  <Badge variant="secondary">{typeLabel(r.type)}</Badge>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/generate" search={{ id: r.id }}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPrinting(r)}>
                    <Download className="mr-2 h-4 w-4" /> PDF
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => void remove(r.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {printing ? (
          <div className="mt-8">
            <LetterDocument letter={printing} />
          </div>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
