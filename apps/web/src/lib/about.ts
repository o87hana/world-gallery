import type { Lang } from "@/lib/i18n";

type TimelineEntry = {
  year: string;
  text: string;
};

type FeaturedEntry = {
  year: string;
  items: FeaturedItem[];
};

type FeaturedItem = {
  title: string;
  url?: string;
};

type SkillGroup = {
  experience: string;
  items: string[];
};

export type AboutContent = {
  role: string;
  name: string;
  portraitAlt: string;
  timeline: TimelineEntry[];
  featuredHeading: string;
  featured: FeaturedEntry[];
  skillsHeading: string;
  skills: SkillGroup[];
  philosophyHeading: string;
  philosophy: string[];
  signature: string;
  portraitUrl?: string;
};

export type SanityDesignerProfile = {
  role_ja?: string;
  role_en?: string;
  name_ja?: string;
  name_en?: string;
  portraitUrl?: string;
  portraitAlt_ja?: string;
  portraitAlt_en?: string;
  timeline?: {year?: string; text_ja?: string; text_en?: string}[];
  featured_heading_ja?: string;
  featured_heading_en?: string;
  featured?: {year?: string; items_ja?: {title_ja?: string; title_en?: string; url?: string}[]; items_en?: {title_ja?: string; title_en?: string; url?: string}[]}[];
  skills_heading_ja?: string;
  skills_heading_en?: string;
  skills?: {experience_ja?: string; experience_en?: string; items_ja?: string[]; items_en?: string[]}[];
  philosophy_heading_ja?: string;
  philosophy_heading_en?: string;
  philosophy_ja?: string[];
  philosophy_en?: string[];
  signature?: string;
};

const sharedFeatured = [
  { year: "2020", items: [{title: "MSDx Summer (FoDR)"}] },
  { year: "2021", items: [{title: "MSDx Winter (Design Studio Alpha)"}, {title: "MSDx Summer (Design Studio Beta)"}] },
  {
    year: "2022",
    items: [{title: "MSDx Winter (Design Studio Gamma, Digital Design)"}, {title: "MSDx Summer (Design Studio Delta)"}],
  },
  {
    year: "2026",
    items: [{title: "Sketch featured in Architects’ journal", url: "https://www.architectsjournal.co.uk/news/sketchbook-hana-murakami"}],
  },
] satisfies FeaturedEntry[];

export const aboutContent = {
  ja: {
    role: "デザイナー",
    name: "Hana Murakami（村上 花）",
    portraitAlt: "村上花のポートレート",
    timeline: [
      { year: "2000", text: "日本生まれ。" },
      { year: "2018", text: "留学生としてオーストラリアへ移住。" },
      {
        year: "2019–2023",
        text: "メルボルン大学で建築学を専攻し、Bachelor of Designを修了。すべての建築設計スタジオ科目でFirst Class Honours（H1）を取得。",
      },
      {
        year: "2024–",
        text: "ロンドンのPitman Tozer ArchitectsでArchitectural Assistantとして勤務開始。",
      },
    ],
    featuredHeading: "主な選出歴",
    featured: sharedFeatured,
    skillsHeading: "スキル",
    skills: [],
    philosophyHeading: "フィロソフィー",
    philosophy: [],
    signature: "HANA MURAKAMI",
  },
  en: {
    role: "Designer",
    name: "Hana Murakami（村上 花）",
    portraitAlt: "Portrait of Hana Murakami",
    timeline: [
      { year: "2000", text: "Born in Japan." },
      { year: "2018", text: "Moved to Australia as an international student." },
      {
        year: "2019–2023",
        text: "Studied at the University of Melbourne, completing a Bachelor of Design with a major in Architecture. Achieved First Class Honours (H1) results in every architecture studio subject.",
      },
      {
        year: "2024–",
        text: "Began working as an Architectural Assistant at Pitman Tozer Architects in London.",
      },
    ],
    featuredHeading: "Featured",
    featured: sharedFeatured,
    skillsHeading: "Skills",
    skills: [],
    philosophyHeading: "Philosophy",
    philosophy: [],
    signature: "HANA MURAKAMI",
  },
} satisfies Record<Lang, AboutContent>;

const featuredItemsForLanguage = (
  items: {title_ja?: string; title_en?: string; url?: string}[] | undefined,
  lang: Lang,
): FeaturedItem[] => (items || []).flatMap((item) => {
  const title = lang === "ja" ? item.title_ja || item.title_en : item.title_en || item.title_ja;
  return title ? [{title, ...(item.url ? {url: item.url} : {})}] : [];
});

export function getAboutContent(lang: Lang, profile?: SanityDesignerProfile | null): AboutContent {
  const fallback = aboutContent[lang];
  if (!profile) return fallback;
  const suffix = lang === "ja" ? "ja" : "en";
  const textKey = `text_${suffix}` as const;
  const itemsKey = `items_${suffix}` as const;
  const experienceKey = `experience_${suffix}` as const;
  return {
    ...fallback,
    role: profile[`role_${suffix}`] ?? fallback.role,
    name: profile[`name_${suffix}`] ?? fallback.name,
    portraitAlt: profile[`portraitAlt_${suffix}`] ?? fallback.portraitAlt,
    portraitUrl: profile.portraitUrl,
    timeline: profile.timeline
      ? profile.timeline.filter((entry) => entry.year && entry[textKey]).map((entry) => ({year: entry.year!, text: entry[textKey]!}))
      : fallback.timeline,
    featuredHeading: profile[`featured_heading_${suffix}`] ?? fallback.featuredHeading,
    featured: profile.featured
      ? profile.featured.filter((entry) => entry.year).map((entry) => ({year: entry.year!, items: featuredItemsForLanguage(entry[itemsKey], lang)}))
      : fallback.featured,
    skillsHeading: profile[`skills_heading_${suffix}`] ?? fallback.skillsHeading,
    skills: profile.skills
      ? profile.skills.filter((group) => group[experienceKey]).map((group) => ({experience: group[experienceKey]!, items: group[itemsKey] || []}))
      : fallback.skills,
    philosophyHeading: profile[`philosophy_heading_${suffix}`] ?? fallback.philosophyHeading,
    philosophy: profile[`philosophy_${suffix}`] ?? fallback.philosophy,
    signature: profile.signature ?? fallback.signature,
  };
}
