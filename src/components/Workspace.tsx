"use client";

import { useState } from "react";
import { type AcademicLevel, type Brief, type ChapterConfig, type GlobalConfig, type ReferencesConfig, type VisualsConfig } from "@/types";

type Tab = "outline" | "chapters" | "references" | "visuals" | "global";
type ExtendedTab = Tab | "discovery";

interface WorkspaceProps {
  currentLevel: AcademicLevel;
  brief: Brief;
  chapters: ChapterConfig[];
  references: ReferencesConfig;
  visuals: VisualsConfig;
  global: GlobalConfig;
}

export function Workspace({ currentLevel, brief, chapters, references, visuals, global }: WorkspaceProps) {
  const [activeTab, setActiveTab] = useState<ExtendedTab>("outline");
  const workspaceStatus = "Configure inputs, then generate research: outline, chapters, references.";
  const [generated, setGenerated] = useState(false);
  const [outline, setOutline] = useState("");
  const [chaptersView, setChaptersView] = useState("");
  const [referencesView, setReferencesView] = useState("");
  const [visualsView, setVisualsView] = useState("");
  const [globalView, setGlobalView] = useState("");
  const [discoveryView, setDiscoveryView] = useState("");

  const tabs: { key: ExtendedTab; label: string }[] = [
    { key: "outline", label: "Outline" },
    { key: "chapters", label: "Chapters" },
    { key: "references", label: "References" },
    { key: "visuals", label: "Tables & Figures plan" },
    { key: "global", label: "Global compliance" },
    { key: "discovery", label: "Literature discovery" },
  ];

  const handleTabClick = (tab: ExtendedTab) => {
    setActiveTab(tab);
  };

  const levelLabel = currentLevel === "msc" ? "MSc" : currentLevel === "phd" ? "PhD" : "Undergrad";
  const totalMin = chapters.reduce((sum, c) => sum + c.minWords, 0);
  const totalMax = chapters.reduce((sum, c) => sum + c.maxWords, 0);

  const handleGenerate = () => {
    const title = brief.title || "Untitled thesis";
    const field = brief.field || "General field";
    const researchType = brief.researchType || "default";
    const outlineText =
      `Title: ${title}\n` +
      `Field: ${field}\n` +
      `Level: ${levelLabel}\n` +
      `Type: ${researchType}\n` +
      `Target words: ${totalMin}–${totalMax}\n\n` +
      chapters.map((c, i) => `${i + 1}. ${c.label} — ${c.minWords}–${c.maxWords} words — Focus: ${c.focus}${c.visuals ? " — Visuals: yes" : ""}`).join("\n");

    const chaptersText =
      `Chapters (${chapters.length})\n` +
      chapters.map((c, i) => `${i + 1}. ${c.label} | Min ${c.minWords} | Max ${c.maxWords} | Visuals ${c.visuals ? "yes" : "no"} | Focus: ${c.focus}`).join("\n");

    const referencesText =
      `References target: ${references.min}–${references.max}\n` +
      `Style: ${references.style}\n` +
      `Recent only: ${references.recentOnly ? "yes" : "no"}\n` +
      `Allow grey literature: ${references.allowGrey ? "yes" : "no"}\n` +
      `Open access preferred: ${references.openAccess ? "yes" : "no"}\n` +
      (references.diversityNote ? `Diversity note: ${references.diversityNote}\n` : "");

    const visualsText =
      `Conceptual diagrams: ${visuals.conceptual ? "yes" : "no"}\n` +
      `Method diagrams: ${visuals.method ? "yes" : "no"}\n` +
      `Tables: ${visuals.tables}\n` +
      `Figures: ${visuals.figures}\n` +
      `Maps: ${visuals.maps ? "yes" : "no"}\n` +
      `Timelines: ${visuals.timelines ? "yes" : "no"}\n` +
      `Networks: ${visuals.networks ? "yes" : "no"}\n` +
      `Label style: ${visuals.labelStyle}\n` +
      `Culturally sensitive labels: ${visuals.culturalSensitive ? "yes" : "no"}`;

    const globalText =
      `Data standards: ${global.dataStandards ? "yes" : "no"}\n` +
      `Multilingual references: ${global.multiLangRefs ? "yes" : "no"}\n` +
      `Interdisciplinary: ${global.interdisciplinary ? "yes" : "no"}\n` +
      `Ethics GDPR: ${global.ethicsGDPR ? "yes" : "no"}\n` +
      `Ethics IRB: ${global.ethicsIRB ? "yes" : "no"}\n` +
      `Ethics Indigenous: ${global.ethicsIndigenous ? "yes" : "no"}`;

    setOutline(outlineText);
    setChaptersView(chaptersText);
    setReferencesView(referencesText);
    setVisualsView(visualsText);
    setGlobalView(globalText);
    const runDiscovery = async () => {
      try {
        const res = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: title,
            field,
            limit: 15,
          }),
        });
        if (!res.ok) return;
        const data = await res.json();
        const items = (data?.items ?? []) as Array<{
          title: string;
          authors: string[];
          year?: number;
          venue?: string;
          url?: string;
          doi?: string;
          source: string;
          openAccess?: boolean;
        }>;
        const lines = items.map((it, i) => {
          const authorStr = it.authors.join(", ");
          const meta = [it.venue, it.year].filter(Boolean).join(" · ");
          const access = it.openAccess ? "OA" : "";
          return `${i + 1}. ${it.title}\n   ${authorStr}\n   ${meta} ${it.doi ? `· DOI:${it.doi}` : ""}\n   ${it.url ?? ""}\n   Source: ${it.source} ${access}`;
        });
        setDiscoveryView(lines.join("\n\n"));
      } catch {
      }
    };
    runDiscovery().finally(() => setGenerated(true));
  };

  const handleReset = () => {
    setOutline("");
    setChaptersView("");
    setReferencesView("");
    setVisualsView("");
    setGlobalView("");
    setGenerated(false);
    setActiveTab("outline");
  };

  return (
    <section className="workspace" aria-label="Workspace and output">
      <div className="tabs" id="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab-btn ${activeTab === tab.key ? "tab-btn--active" : ""}`}
            data-tab={tab.key}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="workspace-bar">
        <p className="workspace-status" id="workspaceStatus">
          {workspaceStatus}
        </p>
        <div className="workspace-actions">
          <button type="button" className="btn btn--secondary" id="resetBtn" onClick={handleReset}>
            <span className="btn-icon">↺</span>
            <span>Reset</span>
          </button>
          <button type="button" className="btn btn--primary" id="generateBtn" onClick={handleGenerate}>
            <span>Generate research</span>
            <span className="btn-icon">⮕</span>
          </button>
        </div>
      </div>

      <div className="tab-panel" id="tabPanel">
        {!generated && <p>Generate to preview structured research outputs.</p>}
        {generated && activeTab === "outline" && <pre>{outline}</pre>}
        {generated && activeTab === "chapters" && <pre>{chaptersView}</pre>}
        {generated && activeTab === "references" && <pre>{referencesView}</pre>}
        {generated && activeTab === "visuals" && <pre>{visualsView}</pre>}
        {generated && activeTab === "global" && <pre>{globalView}</pre>}
        {generated && activeTab === "discovery" && <pre>{discoveryView || "No items found."}</pre>}
      </div>

      <p className="footnote">
        Jermai acts as an AI researcher, generating structured outlines, chapter plans, reference targets, and visuals guidance for globally aware academic work.
      </p>
    </section>
  );
}
