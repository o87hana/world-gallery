import type { Lang } from "@/lib/i18n";

type TimelineEntry = {
  year: string;
  text: string;
};

type FeaturedEntry = {
  year: string;
  items: string[];
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
  featured?: {year?: string; items_ja?: string[]; items_en?: string[]}[];
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
  { year: "2020", items: ["MSDx Summer (FoDR)"] },
  { year: "2021", items: ["MSDx Winter (Design Studio Alpha)", "MSDx Summer (Design Studio Beta)"] },
  {
    year: "2022",
    items: ["MSDx Winter (Design Studio Gamma, Digital Design)", "MSDx Summer (Design Studio Delta)"],
  },
] satisfies FeaturedEntry[];

const sharedSkillItems = [
  ["Rhinoceros", "Adobe InDesign", "Adobe Illustrator", "Adobe Photoshop", "Google Sheets", "Microsoft Office (Word, Excel, PowerPoint)", "Wix"],
  ["Adobe Premiere", "Grasshopper", "Twinmotion"],
  ["AutoCAD", "Archicad"],
] as const;

export const aboutContent = {
  ja: {
    role: "デザイナー",
    name: "Hana Murakami（村上 花）",
    portraitAlt: "村上花のポートレート",
    timeline: [
      { year: "2000", text: "日本生まれ" },
      { year: "2018", text: "留学生としてオーストラリアへ移住" },
      {
        year: "2019",
        text: "メルボルン大学 Bachelor of Designにて、建築学を専攻",
      },
      {
        year: "2023",
        text: "同大学を卒業。すべての建築設計スタジオ科目でFirst Class Honours（H1）を取得",
      },
    ],
    featuredHeading: "主な選出歴",
    featured: sharedFeatured,
    skillsHeading: "スキル",
    skills: [
      { experience: "3年以上", items: [...sharedSkillItems[0]] },
      { experience: "2年以上", items: [...sharedSkillItems[1]] },
      { experience: "1年未満", items: [...sharedSkillItems[2]] },
    ],
    philosophyHeading: "フィロソフィー",
    philosophy: [
      "詩を書くように、建築をデザインしたい。",
      "私のデザインが、生涯にわたって誰かを支え続けるものであってほしい。心に永く残り、必要なときに私たちを救ってくれる美しい詩のような、やさしい言葉を思わせる建築をつくりたいと考えています。",
      "人類の歴史は、いつも成功と発展だけで築かれてきたわけではありません。人生には、悲しみや苦しみに満ちた瞬間があります。私たちは常に前へ進み、より良く変わり続けられるとは限りません。だからこそ、多くの人の人生をそっと包み込み、ともに歩む建築をデザインしたいと思います。",
      "痛みの中にいるとき、その痛みをきちんと感じられるように。",
      "幸せなとき、その幸せを感じられるように。",
      "誰もが偽りなく、正直な自分でいられるように。",
      "それを可能にするのは、どのような空間でしょうか。",
      "人が人であり続けるために。",
      "哲学が永遠に存在し続けるために。",
      "人の感情を建築空間に映すことで、私たちは空間と一つになれます。それによって、自分の居場所を愛おしく思い、自分自身を愛し、より良い人生へとつながっていくのだと信じています。",
    ],
    signature: "HANA MURAKAMI",
  },
  en: {
    role: "Designer",
    name: "Hana Murakami（村上 花）",
    portraitAlt: "Portrait of Hana Murakami",
    timeline: [
      { year: "2000", text: "Born in Japan" },
      { year: "2018", text: "Moved to Australia as an international student" },
      {
        year: "2019",
        text: "Began studying architecture at the University of Melbourne, completing a Bachelor of Design with a major in Architecture",
      },
      {
        year: "2023",
        text: "Graduated from the University of Melbourne with First Class Honours (H1) in every architecture studio subject",
      },
    ],
    featuredHeading: "Featured",
    featured: sharedFeatured,
    skillsHeading: "Skills",
    skills: [
      { experience: "3+ years", items: [...sharedSkillItems[0]] },
      { experience: "2+ years", items: [...sharedSkillItems[1]] },
      { experience: "0–1 year", items: [...sharedSkillItems[2]] },
    ],
    philosophyHeading: "Philosophy",
    philosophy: [
      "I want to design architecture as if I were writing a poem.",
      "I would like my design to keep supporting someone throughout their life. I want to create architecture like gentle words—a beautiful poem that stays in one's mind forever and saves us when needed.",
      "Human history has not always been about success and development. During our lives, there are moments full of sorrow and suffering. We may not always move forward or continue changing for the better. I would like to design architecture that gently embraces people's lives and walks alongside them.",
      "I want people to feel their pain when they are in pain.",
      "I want people to feel happiness when they are happy.",
      "I want people to be their genuine and honest selves.",
      "What kind of space makes this possible?",
      "For humans to remain human.",
      "For philosophy to exist forever.",
      "Reflecting human emotions in architectural space allows us to merge with that space. I believe this helps us cherish the places where we belong, and leads us to love ourselves and live better lives.",
    ],
    signature: "HANA MURAKAMI",
  },
} satisfies Record<Lang, AboutContent>;

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
      ? profile.featured.filter((entry) => entry.year).map((entry) => ({year: entry.year!, items: entry[itemsKey] || []}))
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
