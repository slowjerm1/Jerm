import { type Brief } from "@/types";

interface BriefSectionProps {
  brief: Brief;
  onBriefChange: (brief: Brief) => void;
}

export function BriefSection({ brief, onBriefChange }: BriefSectionProps) {
  const updateBrief = (updates: Partial<Brief>) => {
    onBriefChange({ ...brief, ...updates });
  };

  return (
    <section aria-label="Research brief">
      <div className="panel-title-row">
        <h2 className="panel-title">Research brief</h2>
        <span className="panel-pill">Topic · Context · Paradigm</span>
      </div>

      <div className="field">
        <div className="field-label-row">
          <label className="field-label" htmlFor="title">
            Thesis title / topic
            <span className="field-required">*</span>
          </label>
          <span className="field-hint">Be specific and scoped.</span>
        </div>
        <input
          id="title"
          className="input"
          type="text"
          placeholder="e.g. Cloud-based smart recycling systems for SMEs in Ghana"
          value={brief.title}
          onChange={(e) => updateBrief({ title: e.target.value })}
        />
      </div>

      <div className="field">
        <div className="field-label-row">
          <label className="field-label" htmlFor="field">
            Discipline / field
            <span className="field-required">*</span>
          </label>
          <span className="field-hint">E.g. Computer Science, Sociology, History.</span>
        </div>
        <input
          id="field"
          className="input"
          type="text"
          placeholder="e.g. Information Systems"
          value={brief.field}
          onChange={(e) => updateBrief({ field: e.target.value })}
        />
      </div>

      <div className="split-row">
        <div className="field">
          <div className="field-label-row">
            <label className="field-label" htmlFor="region">
              Country / region
            </label>
            <span className="field-hint">Optional.</span>
          </div>
          <input
            id="region"
            className="input"
            type="text"
            placeholder="e.g. Ghana"
            value={brief.region}
            onChange={(e) => updateBrief({ region: e.target.value })}
          />
        </div>
        <div className="field">
          <div className="field-label-row">
            <label className="field-label" htmlFor="method">
              Methodology type
            </label>
            <span className="field-hint">Quantitative / qualitative / mixed.</span>
          </div>
          <select
            id="method"
            className="select"
            value={brief.method}
            onChange={(e) => updateBrief({ method: e.target.value })}
          >
            <option value="">Select methodology</option>
            <option value="quantitative">Quantitative</option>
            <option value="qualitative">Qualitative</option>
            <option value="mixed">Mixed methods</option>
          </select>
        </div>
      </div>

      <div className="split-row">
        <div className="field">
          <div className="field-label-row">
            <label className="field-label" htmlFor="researchType">
              Research type
            </label>
            <span className="field-hint">Empirical, theoretical, applied, etc.</span>
          </div>
          <select
            id="researchType"
            className="select"
            value={brief.researchType}
            onChange={(e) => updateBrief({ researchType: e.target.value })}
          >
            <option value="">Select research type</option>
            <option value="empirical">Empirical / experimental</option>
            <option value="theoretical">Theoretical / conceptual</option>
            <option value="applied">Applied / practical</option>
            <option value="exploratory">Descriptive / exploratory</option>
            <option value="action">Action / participatory</option>
            <option value="historical">Historical / archival</option>
            <option value="comparative">Comparative / cross-cultural</option>
          </select>
        </div>
        <div className="field">
          <div className="field-label-row">
            <label className="field-label" htmlFor="paradigm">
              Research paradigm
            </label>
            <span className="field-hint">Positivist, interpretivist, etc.</span>
          </div>
          <select
            id="paradigm"
            className="select"
            value={brief.paradigm}
            onChange={(e) => updateBrief({ paradigm: e.target.value })}
          >
            <option value="">Select paradigm</option>
            <option value="positivist">Positivist</option>
            <option value="interpretivist">Interpretivist</option>
            <option value="critical">Critical</option>
            <option value="pragmatic">Pragmatic</option>
          </select>
        </div>
      </div>

      <div className="field">
        <div className="field-label-row">
          <label className="field-label" htmlFor="institution">
            Institution / format guide
          </label>
          <span className="field-hint">E.g. UG SGS style, NSF-style.</span>
        </div>
        <input
          id="institution"
          className="input"
          type="text"
          placeholder="e.g. University of Ghana SGS format"
          value={brief.institution}
          onChange={(e) => updateBrief({ institution: e.target.value })}
        />
      </div>

      <div className="field">
        <div className="field-label-row">
          <label className="field-label" htmlFor="culture">
            Cultural / contextual focus
          </label>
          <span className="field-hint">E.g. decolonial, feminist, Afrocentric.</span>
        </div>
        <textarea
          id="culture"
          className="textarea"
          placeholder="E.g. Decolonial and Afrocentric approach; integrate local knowledge systems and non-Western frameworks."
          value={brief.culture}
          onChange={(e) => updateBrief({ culture: e.target.value })}
        />
      </div>

      <div className="field">
        <div className="field-label-row">
          <label className="field-label" htmlFor="notes">
            Extra constraints
          </label>
          <span className="field-hint">Ethics, data limits, etc.</span>
        </div>
        <textarea
          id="notes"
          className="textarea"
          placeholder="E.g. Use 2018+ sources where possible, emphasise policy documents, apply Harvard referencing."
          value={brief.notes}
          onChange={(e) => updateBrief({ notes: e.target.value })}
        />
      </div>
    </section>
  );
}
