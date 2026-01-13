import { NextRequest } from "next/server";
import { z } from "zod";
import {
  defaultProviders,
  type ResearchProvider,
} from "@/lib/research/providers";
import { type ResearchItem } from "@/types";

const bodySchema = z.object({
  query: z.string().min(2),
  field: z.string().optional(),
  limit: z.number().int().min(1).max(50).optional(),
  providers: z.array(z.string()).optional(),
});

async function runProviders(
  providers: ResearchProvider[],
  query: string,
  field?: string,
  limit?: number
): Promise<ResearchItem[]> {
  const tasks = providers.map((p) =>
    p
      .search({ query, field, limit })
      .then((items) => items.map((i) => ({ ...i, source: i.source || p.id })))
      .catch(() => [])
  );
  const results = await Promise.all(tasks);
  const merged = results.flat();
  const seen = new Set<string>();
  const dedup: ResearchItem[] = [];
  for (const r of merged) {
    const key = (r.doi || r.url || r.title).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    dedup.push(r);
  }
  return dedup.slice(0, limit ?? 25);
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        { error: "invalid_body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { query, field, limit, providers } = parsed.data;
    const active =
      (providers && defaultProviders.filter((p) => providers.includes(p.id))) ||
      defaultProviders;
    const items = await runProviders(active, query, field, limit);
    return Response.json({ items });
  } catch {
    return Response.json({ error: "server_error" }, { status: 500 });
  }
}
