import { type ResearchItem, type ResearchQuery } from "@/types";

export interface ResearchProvider {
  id: string;
  search: (q: ResearchQuery) => Promise<ResearchItem[]>;
}

function toItems<T>(
  arr: T[],
  map: (x: T) => ResearchItem | undefined
): ResearchItem[] {
  const out: ResearchItem[] = [];
  for (const v of arr) {
    const m = map(v);
    if (m) out.push(m);
  }
  return out;
}

export const crossrefProvider: ResearchProvider = {
  id: "crossref",
  async search(q) {
    const url = new URL("https://api.crossref.org/works");
    url.searchParams.set("query", q.query);
    url.searchParams.set("rows", String(q.limit ?? 10));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return [];
    const j: unknown = await res.json();
    const msg = (j as { message?: { items?: unknown[] } }).message;
    const items = Array.isArray(msg?.items) ? msg!.items : [];
    return toItems(items, (raw) => {
      const it = raw as {
        title?: string[] | string;
        author?: Array<{ given?: string; family?: string }>;
        published?: { ["date-parts"]?: number[][] };
        created?: { ["date-parts"]?: number[][] };
        ["container-title"]?: string[];
        URL?: string;
        DOI?: string;
        license?: unknown;
      };
      const title = Array.isArray(it.title) ? it.title[0] : it.title;
      if (!title) return undefined;
      const authors: string[] = Array.isArray(it.author)
        ? it.author
            .map((a) => [a?.given, a?.family].filter(Boolean).join(" "))
            .filter((x) => x.length > 0)
        : [];
      const year =
        Array.isArray(it.published?.["date-parts"]) &&
        Array.isArray(it.published?.["date-parts"]![0])
          ? it.published?.["date-parts"]![0]![0]
          : Array.isArray(it.created?.["date-parts"]) &&
            Array.isArray(it.created?.["date-parts"]![0])
          ? it.created?.["date-parts"]![0]![0]
          : undefined;
      const venue = Array.isArray(it["container-title"])
        ? it["container-title"][0]
        : undefined;
      const url = it.URL;
      const doi = it.DOI;
      const oa = Boolean(it["license"]);
      return {
        title,
        authors,
        year,
        venue,
        url,
        doi,
        source: "Crossref",
        openAccess: oa,
      };
    });
  },
};

export const arxivProvider: ResearchProvider = {
  id: "arxiv",
  async search(q) {
    const url = new URL("http://export.arxiv.org/api/query");
    url.searchParams.set("search_query", `all:${q.query}`);
    url.searchParams.set("start", "0");
    url.searchParams.set("max_results", String(q.limit ?? 10));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return [];
    const text = await res.text();
    const entries = text.split("<entry>").slice(1);
    const items: ResearchItem[] = entries.map((e) => {
      const titleMatch = e.match(/<title>([\s\S]*?)<\/title>/);
      const title = titleMatch ? titleMatch[1].trim() : "arXiv item";
      const authorMatches = [...e.matchAll(/<name>(.*?)<\/name>/g)];
      const authors = authorMatches.map((m) => m[1]);
      const linkMatch = e.match(/<link[^>]*href="(.*?)"/);
      const url = linkMatch ? linkMatch[1] : undefined;
      const yearMatch = e.match(/<published>(\d{4})-/);
      const year = yearMatch ? Number(yearMatch[1]) : undefined;
      return {
        title,
        authors,
        year,
        venue: "arXiv",
        url,
        source: "arXiv",
        openAccess: true,
      };
    });
    return items.slice(0, q.limit ?? 10);
  },
};

export const openAlexProvider: ResearchProvider = {
  id: "openalex",
  async search(q) {
    const url = new URL("https://api.openalex.org/works");
    url.searchParams.set("search", q.query);
    url.searchParams.set("per_page", String(q.limit ?? 10));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return [];
    const j: unknown = await res.json();
    const data = Array.isArray((j as { results?: unknown[] }).results)
      ? (j as { results: unknown[] }).results
      : [];
    return toItems(data, (raw) => {
      const w = raw as {
        title?: string;
        authorships?: Array<{ author?: { display_name?: string } }>;
        publication_year?: number;
        host_venue?: { display_name?: string };
        open_access?: { oa_url?: string; is_oa?: boolean };
        primary_location?: { landing_page_url?: string };
        id?: string;
        doi?: string;
      };
      const title = w.title;
      if (!title) return undefined;
      const authors = Array.isArray(w.authorships)
        ? w.authorships
            .map((a) => a.author?.display_name)
            .filter((x) => Boolean(x)) as string[]
        : [];
      const year = w.publication_year;
      const venue = w.host_venue?.display_name;
      const url =
        w.open_access?.oa_url || w.primary_location?.landing_page_url || w.id;
      const doi = w.doi;
      const oa = Boolean(w.open_access?.is_oa);
      return {
        title,
        authors,
        year,
        venue,
        url,
        doi,
        source: "OpenAlex",
        openAccess: oa,
      };
    });
  },
};

export const pubmedProvider: ResearchProvider = {
  id: "pubmed",
  async search(q) {
    const esearch = new URL(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    );
    esearch.searchParams.set("db", "pubmed");
    esearch.searchParams.set("term", q.query);
    esearch.searchParams.set("retmax", String(q.limit ?? 10));
    const idsRes = await fetch(esearch.toString(), { cache: "no-store" });
    if (!idsRes.ok) return [];
    const idsText = await idsRes.text();
    const idMatches = [...idsText.matchAll(/<Id>(\d+)<\/Id>/g)];
    const ids = idMatches.map((m) => m[1]).slice(0, q.limit ?? 10);
    if (!ids.length) return [];
    const efetch = new URL(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
    );
    efetch.searchParams.set("db", "pubmed");
    efetch.searchParams.set("id", ids.join(","));
    efetch.searchParams.set("retmode", "xml");
    const res = await fetch(efetch.toString(), { cache: "no-store" });
    if (!res.ok) return [];
    const xml = await res.text();
    const records = xml.split("<PubmedArticle>").slice(1);
    return records.map((rec) => {
      const titleMatch = rec.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/);
      const title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "";
      const authorMatches = [
        ...rec.matchAll(/<ForeName>(.*?)<\/ForeName>[\s\S]*?<LastName>(.*?)<\/LastName>/g),
      ];
      const authors = authorMatches.map((m) => `${m[1]} ${m[2]}`);
      const journalMatch = rec.match(/<Title>(.*?)<\/Title>/);
      const venue = journalMatch ? journalMatch[1] : undefined;
      const yearMatch = rec.match(/<Year>(\d{4})<\/Year>/);
      const year = yearMatch ? Number(yearMatch[1]) : undefined;
      const pmidMatch = rec.match(/<PMID.*?>(\d+)<\/PMID>/);
      const pmid = pmidMatch ? pmidMatch[1] : undefined;
      const url = pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : undefined;
      return {
        title,
        authors,
        year,
        venue,
        url,
        source: "PubMed",
        openAccess: false,
      };
    });
  },
};

export const defaultProviders: ResearchProvider[] = [
  crossrefProvider,
  openAlexProvider,
  arxivProvider,
  pubmedProvider,
];
