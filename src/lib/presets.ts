import { type AcademicLevel, type ChapterConfig } from "@/types";

export const LEVEL_PRESETS: Record<
  AcademicLevel,
  Record<string, ChapterConfig[]>
> = {
  undergrad: {
    default: [
      {
        label: "1 – Introduction",
        minWords: 1200,
        maxWords: 1500,
        visuals: false,
        focus: "General overview",
      },
      {
        label: "2 – Literature Review",
        minWords: 2500,
        maxWords: 3500,
        visuals: true,
        focus: "Literature synthesis",
      },
      {
        label: "3 – Methodology",
        minWords: 2000,
        maxWords: 2800,
        visuals: true,
        focus: "Data collection",
      },
      {
        label: "4 – Results / Analysis",
        minWords: 2200,
        maxWords: 2800,
        visuals: true,
        focus: "Data analysis",
      },
      {
        label: "5 – Discussion / Conclusion",
        minWords: 1500,
        maxWords: 2200,
        visuals: false,
        focus: "Implementation / recommendations",
      },
    ],
  },
  msc: {
    default: [
      {
        label: "1 – Introduction",
        minWords: 1400,
        maxWords: 1600,
        visuals: false,
        focus: "General overview",
      },
      {
        label: "2 – Literature Review",
        minWords: 3500,
        maxWords: 5000,
        visuals: true,
        focus: "Literature synthesis",
      },
      {
        label: "3 – Methodology",
        minWords: 2500,
        maxWords: 4000,
        visuals: true,
        focus: "Data collection",
      },
      {
        label: "4 – Results / Analysis",
        minWords: 3500,
        maxWords: 4000,
        visuals: true,
        focus: "Data analysis",
      },
      {
        label: "5 – Discussion / Conclusion",
        minWords: 2000,
        maxWords: 2500,
        visuals: false,
        focus: "Implementation / recommendations",
      },
    ],
    empirical: [
      {
        label: "1 – Introduction",
        minWords: 1400,
        maxWords: 1600,
        visuals: false,
        focus: "General overview",
      },
      {
        label: "2 – Literature Review",
        minWords: 3200,
        maxWords: 4500,
        visuals: true,
        focus: "Literature synthesis",
      },
      {
        label: "3 – Methodology",
        minWords: 3000,
        maxWords: 5000,
        visuals: true,
        focus: "Data collection",
      },
      {
        label: "4 – Results / Analysis",
        minWords: 3500,
        maxWords: 4500,
        visuals: true,
        focus: "Data analysis",
      },
      {
        label: "5 – Discussion / Conclusion",
        minWords: 2200,
        maxWords: 2600,
        visuals: false,
        focus: "Implementation / recommendations",
      },
    ],
    theoretical: [
      {
        label: "1 – Introduction",
        minWords: 1400,
        maxWords: 1800,
        visuals: false,
        focus: "General overview",
      },
      {
        label: "2 – Literature Review",
        minWords: 5000,
        maxWords: 7000,
        visuals: true,
        focus: "Literature synthesis",
      },
      {
        label: "3 – Methodology",
        minWords: 2200,
        maxWords: 3200,
        visuals: true,
        focus: "Data collection",
      },
      {
        label: "4 – Results / Analysis",
        minWords: 2600,
        maxWords: 3200,
        visuals: true,
        focus: "Data analysis",
      },
      {
        label: "5 – Discussion / Conclusion",
        minWords: 2000,
        maxWords: 2600,
        visuals: false,
        focus: "Implementation / recommendations",
      },
    ],
  },
  phd: {
    default: [
      {
        label: "1 – Introduction",
        minWords: 1800,
        maxWords: 2500,
        visuals: false,
        focus: "General overview",
      },
      {
        label: "2 – Literature Review",
        minWords: 6000,
        maxWords: 9000,
        visuals: true,
        focus: "Literature synthesis",
      },
      {
        label: "3 – Methodology",
        minWords: 4000,
        maxWords: 6000,
        visuals: true,
        focus: "Data collection",
      },
      {
        label: "4 – Results / Analysis",
        minWords: 6000,
        maxWords: 9000,
        visuals: true,
        focus: "Data analysis",
      },
      {
        label: "5 – Discussion / Conclusion",
        minWords: 3000,
        maxWords: 4500,
        visuals: false,
        focus: "Implementation / recommendations",
      },
    ],
  },
};
