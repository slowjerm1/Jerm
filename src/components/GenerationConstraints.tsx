import { Dispatch, SetStateAction } from "react";
import { type AcademicLevel, type ChapterConfig, type ReferencesConfig, type VisualsConfig, type GlobalConfig } from "@/types";

interface GenerationConstraintsProps {
  currentLevel: AcademicLevel;
  chapters: ChapterConfig[];
  onChaptersChange: Dispatch<SetStateAction<ChapterConfig[]>>;
  references: ReferencesConfig;
  onReferencesChange: Dispatch<SetStateAction<ReferencesConfig>>;
  visuals: VisualsConfig;
  onVisualsChange: Dispatch<SetStateAction<VisualsConfig>>;
  global: GlobalConfig;
  onGlobalChange: Dispatch<SetStateAction<GlobalConfig>>;
}

export function GenerationConstraints({
  currentLevel,
  chapters,
  onChaptersChange,
  references,
  onReferencesChange,
  visuals,
  onVisualsChange,
  global,
  onGlobalChange,
}: GenerationConstraintsProps) {
  // Log props to demonstrate they're being received (remove in production)
  console.log({
    currentLevel,
    chapters,
    references,
    visuals,
    global
  });

  // Event handlers will be used in future implementations
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _eventHandlers = {
    onChaptersChange,
    onReferencesChange,
    onVisualsChange,
    onGlobalChange
  };

  return (
    <section aria-label="Generation constraints">
      <div className="panel-title-row">
        <h2 className="panel-title">Generation constraints</h2>
        <span className="panel-pill">
          {chapters.length} chapters · {references.min}-{references.max} references
        </span>
      </div>

      {/* Chapter structure */}
      <div className="field">
        <div className="field-label-row">
          <span className="field-label">
            Chapter structure
            <span className="field-required">*</span>
          </span>
          <span className="field-hint">Adjust per level and research type.</span>
        </div>

        <div className="chapters-card" id="chaptersCard">
          <div className="chapters-header">
            <span>Chapter</span>
            <span>Min words</span>
            <span>Max words</span>
            <span>Visuals?</span>
            <span>Focus</span>
          </div>
          {/* Rows will be rendered here */}
        </div>

        <div className="metrics-row" id="metricsRow">
          <span className="pill pill-strong" id="totalWords">
            Total target: {chapters.reduce((s, c) => s + c.minWords, 0)}–
            {chapters.reduce((s, c) => s + c.maxWords, 0)}
          </span>
          <span className="pill" id="levelHint">
            Level preset: {currentLevel === "msc" ? "MSc" : currentLevel === "phd" ? "PhD" : "Undergrad"} {chapters.length ? "active" : "default"}
          </span>
        </div>
      </div>

      {/* References */}
      <div className="field">
        <div className="field-label-row">
          <span className="field-label">
            References
            <span className="field-required">*</span>
          </span>
          <span className="field-hint">Verifiable, diverse, global.</span>
        </div>
        {/* References fields */}
      </div>

      {/* Visuals */}
      <div className="field">
        <div className="field-label-row">
          <span className="field-label">
            Diagrams, tables, figures
          </span>
          <span className="field-hint">Frameworks, timelines, maps, networks.</span>
        </div>
        {/* Visuals grid */}
      </div>

      {/* Global adaptations */}
      <div className="global-card">
        <div className="global-card-title">Global adaptations & ethics</div>
        <div className="global-row">
          {/* Checkboxes */}
        </div>
      </div>
    </section>
  );
}
