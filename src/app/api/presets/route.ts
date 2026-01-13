import { NextRequest } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { LEVEL_PRESETS } from "@/lib/presets";
import { type AcademicLevel, type ChapterConfig } from "@/types";

const bodySchema = z.object({
  currentLevel: z.enum(["undergrad", "msc", "phd"]),
  researchType: z.string().optional(),
  briefTitle: z.string().optional(),
  field: z.string().optional(),
});

function fallbackPresets(
  level: AcademicLevel,
  researchType?: string
): ChapterConfig[] {
  const levelPresets = LEVEL_PRESETS[level];
  const preset =
    (researchType && levelPresets[researchType]) || levelPresets.default;
  return preset;
}

function totals(chapters: ChapterConfig[]) {
  const totalMin = chapters.reduce((s, c) => s + c.minWords, 0);
  const totalMax = chapters.reduce((s, c) => s + c.maxWords, 0);
  return { totalMin, totalMax };
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
    const { currentLevel, researchType, briefTitle, field } = parsed.data;
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      const chapters = fallbackPresets(currentLevel, researchType);
      const { totalMin, totalMax } = totals(chapters);
      return Response.json({
        source: "default",
        chapters,
        totalMin,
        totalMax,
      });
    }
    const client = new OpenAI({ apiKey: key });
    const baseChapters = fallbackPresets(currentLevel, researchType);
    const prompt =
      `Adjust chapter presets for ${currentLevel}${
        researchType ? `, ${researchType}` : ""
      }.\n` +
      `Title: ${briefTitle || "Untitled"}\n` +
      `Field: ${field || "General"}\n` +
      `Base chapters:\n` +
      baseChapters
        .map(
          (c, i) =>
            `${i + 1}. ${c.label} | ${c.minWords}-${c.maxWords} | visuals:${
              c.visuals ? "yes" : "no"
            } | focus:${c.focus}`
        )
        .join("\n") +
      `\nReturn JSON array with {label,minWords,maxWords,visuals,focus}. Keep realistic totals and logical distribution. Output JSON only, no prose.`;
    let chapters: ChapterConfig[] = baseChapters;
    try {
      const r = await client.responses.create({
        model: "gpt-4o-mini",
        input: prompt,
      });
      const text = r.output_text;
      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(text);
      } catch {
        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");
        const jsonSlice =
          start !== -1 && end !== -1 ? text.slice(start, end + 1) : "[]";
        parsedJson = JSON.parse(jsonSlice);
      }
      const arr = Array.isArray(parsedJson)
        ? parsedJson
        : parsedJson &&
          typeof parsedJson === "object" &&
          "chapters" in parsedJson &&
          Array.isArray((parsedJson as any).chapters)
        ? (parsedJson as any).chapters
        : [];
      if (Array.isArray(arr)) {
        chapters = arr
          .map((c) => ({
            label: String(c.label),
            minWords: Number(c.minWords),
            maxWords: Number(c.maxWords),
            visuals: Boolean(c.visuals),
            focus: String(c.focus),
          }))
          .filter(
            (c) =>
              c.label &&
              Number.isFinite(c.minWords) &&
              Number.isFinite(c.maxWords) &&
              c.minWords > 0 &&
              c.maxWords >= c.minWords
          );
        if (chapters.length === 0) chapters = baseChapters;
      }
    } catch {
      chapters = baseChapters;
    }
    const { totalMin, totalMax } = totals(chapters);
    return Response.json({
      source: "ai",
      chapters,
      totalMin,
      totalMax,
    });
  } catch {
    return Response.json({ error: "server_error" }, { status: 500 });
  }
}
