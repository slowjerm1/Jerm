export interface ChapterConfig {
  label: string;
  minWords: number;
  maxWords: number;
  visuals: boolean;
  focus: string;
}

export interface Brief {
  title: string;
  field: string;
  region: string;
  method: string;
  researchType: string;
  paradigm: string;
  institution: string;
  culture: string;
  notes: string;
  globalMode: boolean;
}

export interface ReferencesConfig {
  min: number;
  max: number;
  style: string;
  recentOnly: boolean;
  allowGrey: boolean;
  diversityNote: string;
  openAccess: boolean;
}

export interface VisualsConfig {
  conceptual: boolean;
  method: boolean;
  tables: number;
  figures: number;
  maps: boolean;
  timelines: boolean;
  networks: boolean;
  labelStyle: string;
  culturalSensitive: boolean;
}

export interface GlobalConfig {
  dataStandards: boolean;
  multiLangRefs: boolean;
  interdisciplinary: boolean;
  ethicsGDPR: boolean;
  ethicsIRB: boolean;
  ethicsIndigenous: boolean;
}

export interface Summary {
  prompt: string;
  chapters: ChapterConfig[];
  totalMin: number;
  totalMax: number;
  refs: ReferencesConfig;
  visuals: VisualsConfig;
  brief: Brief;
  global: GlobalConfig;
  levelLabel: string;
}

export type AcademicLevel = "undergrad" | "msc" | "phd";

export interface ResearchItem {
  title: string;
  authors: string[];
  year?: number;
  venue?: string;
  url?: string;
  doi?: string;
  source: string;
  openAccess?: boolean;
}

export interface ResearchQuery {
  query: string;
  field?: string;
  limit?: number;
}
