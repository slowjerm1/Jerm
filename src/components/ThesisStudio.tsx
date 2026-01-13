'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LEVEL_PRESETS } from '@/lib/presets';

// Client-side only components with proper typing for named exports
const BriefSection = dynamic(
  () => import('./BriefSection').then(mod => mod.BriefSection),
  { ssr: false }
);

const GenerationConstraints = dynamic(
  () => import('./GenerationConstraints').then(mod => mod.GenerationConstraints),
  { ssr: false }
);

const Workspace = dynamic(
  () => import('./Workspace').then(mod => mod.Workspace),
  { ssr: false }
);
import { type Brief, type AcademicLevel, type ChapterConfig, type ReferencesConfig, type VisualsConfig, type GlobalConfig } from "@/types";

const LOCAL_PRESETS = LEVEL_PRESETS;

export function ThesisStudio() {
  const [currentLevel, setCurrentLevel] = useState<AcademicLevel>("undergrad");
  const [brief, setBrief] = useState<Brief>({
    title: "",
    field: "",
    region: "",
    method: "",
    researchType: "",
    paradigm: "",
    institution: "",
    culture: "",
    notes: "",
    globalMode: false,
  });

  const [chapters, setChapters] = useState<ChapterConfig[]>([]);
  const [references, setReferences] = useState<ReferencesConfig>({
    min: 40,
    max: 80,
    style: "harvard",
    recentOnly: true,
    allowGrey: true,
    diversityNote: "",
    openAccess: false,
  });
  const [visuals, setVisuals] = useState<VisualsConfig>({
    conceptual: true,
    method: true,
    tables: 6,
    figures: 6,
    maps: false,
    timelines: false,
    networks: false,
    labelStyle: "2.1",
    culturalSensitive: false,
  });
  const [global, setGlobal] = useState<GlobalConfig>({
    dataStandards: false,
    multiLangRefs: false,
    interdisciplinary: false,
    ethicsGDPR: false,
    ethicsIRB: false,
    ethicsIndigenous: false,
  });

  useEffect(() => {
    const researchType = brief.researchType || "default";
    const levelPresets = LOCAL_PRESETS[currentLevel];
    const preset = levelPresets[researchType as keyof typeof levelPresets] || levelPresets.default;
    const controller = new AbortController();
    const run = async () => {
      try {
        const res = await fetch("/api/presets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentLevel,
            researchType,
            briefTitle: brief.title,
            field: brief.field,
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          setChapters(preset);
          return;
        }
        const data = await res.json();
        const chapters = (data?.chapters ?? preset) as ChapterConfig[];
        setChapters(chapters);
      } catch {
        setChapters(preset);
      }
    };
    run();
    return () => controller.abort();
  }, [currentLevel, brief.researchType, brief.title, brief.field]);

  // Use a state to track if component is mounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything during SSR or before the component mounts on the client
  if (!isMounted) {
    return (
      <div className="app-shell" suppressHydrationWarning>
        <section className="card" aria-label="Jermai thesis studio" />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <section className="card" aria-label="Jermai thesis studio">
        <header className="header">
          <div className="header-main">
            <div className="brand-row">
              <div className="brand-badge">
                <span className="brand-dot"></span>
                <span>AI-native research</span>
              </div>
            </div>
            <div className="brand-title">
              <span>Jerm</span>
              <span className="brand-highlight">ai</span>
              <span className="brand-suffix">Global Thesis Studio</span>
            </div>
            <p className="brand-subtitle">
              Configure chapter lengths, research types, references, and visuals. Generate structured research outputs for Undergrad, MSc, or PhD work worldwide.
            </p>
          </div>

          <div className="header-controls">
            <div className="header-controls-top">
              <div className="level-toggle">
                {(["undergrad", "msc", "phd"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`level-btn ${currentLevel === level ? "level-btn--active" : ""}`}
                    data-level={level}
                    onClick={() => setCurrentLevel(level)}
                  >
                    {level === "msc" ? "MSc" : level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
              <label className="global-toggle">
                <input
                  type="checkbox"
                  id="globalMode"
                  checked={brief.globalMode}
                  onChange={(e) => setBrief(prev => ({ ...prev, globalMode: e.target.checked }))}
                />
                <span>International mode</span>
              </label>
            </div>
            <div className="status-chip">
              <span className="status-chip-dot"></span>
              <span>Draft only – verify all sources</span>
            </div>
          </div>
        </header>

        <div className="main-grid">
          <BriefSection brief={brief} onBriefChange={setBrief} />
          <GenerationConstraints
            currentLevel={currentLevel}
            chapters={chapters}
            onChaptersChange={setChapters}
            references={references}
            onReferencesChange={setReferences}
            visuals={visuals}
            onVisualsChange={setVisuals}
            global={global}
            onGlobalChange={setGlobal}
          />
        </div>

        <Workspace
          currentLevel={currentLevel}
          brief={brief}
          chapters={chapters}
          references={references}
          visuals={visuals}
          global={global}
        />
      </section>
    </div>
  );
}
