import {defineField, defineType} from 'sanity'

const timelineEntry = defineType({
  name: 'designerTimelineEntry',
  title: 'Timeline entry',
  type: 'object',
  fields: [
    defineField({name: 'year', title: 'Year', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'text_ja', title: 'Text (Japanese)', type: 'text', rows: 2}),
    defineField({name: 'text_en', title: 'Text (English)', type: 'text', rows: 2}),
  ],
  preview: {select: {title: 'year', subtitle: 'text_en'}},
})

const featuredItem = defineType({
  name: 'designerFeaturedItem',
  title: 'Featured item',
  type: 'object',
  fields: [
    defineField({name: 'title_ja', title: 'Title (Japanese)', type: 'string'}),
    defineField({name: 'title_en', title: 'Title (English)', type: 'string'}),
    defineField({name: 'url', title: 'Link URL', type: 'url', validation: (Rule) => Rule.uri({scheme: ['http', 'https']})}),
  ],
  preview: {select: {title: 'title_en', subtitle: 'url'}},
})

const featuredEntry = defineType({
  name: 'designerFeaturedEntry',
  title: 'Featured entry',
  type: 'object',
  fields: [
    defineField({name: 'year', title: 'Year', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'items_ja', title: 'Items (Japanese)', type: 'array', of: [{type: 'designerFeaturedItem'}]}),
    defineField({name: 'items_en', title: 'Items (English)', type: 'array', of: [{type: 'designerFeaturedItem'}]}),
  ],
  preview: {select: {title: 'year'}},
})

const skillGroup = defineType({
  name: 'designerSkillGroup',
  title: 'Skill group',
  type: 'object',
  fields: [
    defineField({name: 'experience_ja', title: 'Experience (Japanese)', type: 'string'}),
    defineField({name: 'experience_en', title: 'Experience (English)', type: 'string'}),
    defineField({name: 'items_ja', title: 'Skills (Japanese)', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'items_en', title: 'Skills (English)', type: 'array', of: [{type: 'string'}]}),
  ],
  preview: {select: {title: 'experience_en'}},
})

export const designerProfile = defineType({
  name: 'designerProfile',
  title: 'Designer Profile',
  type: 'document',
  fields: [
    defineField({name: 'role_ja', title: 'Role (Japanese)', type: 'string'}),
    defineField({name: 'role_en', title: 'Role (English)', type: 'string'}),
    defineField({name: 'name_ja', title: 'Name (Japanese)', type: 'string'}),
    defineField({name: 'name_en', title: 'Name (English)', type: 'string'}),
    defineField({name: 'portrait', title: 'Portrait', type: 'image', options: {hotspot: true}, fields: [
      defineField({name: 'alt_ja', title: 'Alt (Japanese)', type: 'string'}),
      defineField({name: 'alt_en', title: 'Alt (English)', type: 'string'}),
    ]}),
    defineField({name: 'timeline', title: 'Education & timeline', type: 'array', of: [{type: 'designerTimelineEntry'}]}),
    defineField({name: 'featured_heading_ja', title: 'Featured heading (Japanese)', type: 'string'}),
    defineField({name: 'featured_heading_en', title: 'Featured heading (English)', type: 'string'}),
    defineField({name: 'featured', title: 'Featured', type: 'array', of: [{type: 'designerFeaturedEntry'}]}),
    defineField({name: 'skills_heading_ja', title: 'Skills heading (Japanese)', type: 'string'}),
    defineField({name: 'skills_heading_en', title: 'Skills heading (English)', type: 'string'}),
    defineField({name: 'skills', title: 'Skills', type: 'array', of: [{type: 'designerSkillGroup'}]}),
    defineField({name: 'philosophy_heading_ja', title: 'Philosophy heading (Japanese)', type: 'string'}),
    defineField({name: 'philosophy_heading_en', title: 'Philosophy heading (English)', type: 'string'}),
    defineField({name: 'philosophy_ja', title: 'Philosophy (Japanese)', type: 'array', of: [{type: 'text'}]}),
    defineField({name: 'philosophy_en', title: 'Philosophy (English)', type: 'array', of: [{type: 'text'}]}),
    defineField({name: 'signature', title: 'Signature', type: 'string'}),
  ],
  initialValue: {
    role_ja: 'デザイナー', role_en: 'Designer',
    name_ja: 'Hana Murakami（村上 花）', name_en: 'Hana Murakami（村上 花）',
    timeline: [
      {year: '2000', text_ja: '日本生まれ。', text_en: 'Born in Japan.'},
      {year: '2018', text_ja: '留学生としてオーストラリアへ移住。', text_en: 'Moved to Australia as an international student.'},
      {year: '2019–2023', text_ja: 'メルボルン大学で建築学を専攻し、Bachelor of Designを修了。すべての建築設計スタジオ科目でFirst Class Honours（H1）を取得。', text_en: 'Studied at the University of Melbourne, completing a Bachelor of Design with a major in Architecture. Achieved First Class Honours (H1) results in every architecture studio subject.'},
      {year: '2024–', text_ja: 'ロンドンのPitman Tozer ArchitectsでArchitectural Assistantとして勤務開始。', text_en: 'Began working as an Architectural Assistant at Pitman Tozer Architects in London.'},
    ],
    featured_heading_ja: '主な選出歴', featured_heading_en: 'Featured',
    featured: [
      {year: '2020', items_ja: [{title_ja: 'MSDx Summer (FoDR)', title_en: 'MSDx Summer (FoDR)'}], items_en: [{title_ja: 'MSDx Summer (FoDR)', title_en: 'MSDx Summer (FoDR)'}]},
      {year: '2021', items_ja: [{title_ja: 'MSDx Winter (Design Studio Alpha)', title_en: 'MSDx Winter (Design Studio Alpha)'}, {title_ja: 'MSDx Summer (Design Studio Beta)', title_en: 'MSDx Summer (Design Studio Beta)'}], items_en: [{title_ja: 'MSDx Winter (Design Studio Alpha)', title_en: 'MSDx Winter (Design Studio Alpha)'}, {title_ja: 'MSDx Summer (Design Studio Beta)', title_en: 'MSDx Summer (Design Studio Beta)'}]},
      {year: '2022', items_ja: [{title_ja: 'MSDx Winter (Design Studio Gamma, Digital Design)', title_en: 'MSDx Winter (Design Studio Gamma, Digital Design)'}, {title_ja: 'MSDx Summer (Design Studio Delta)', title_en: 'MSDx Summer (Design Studio Delta)'}], items_en: [{title_ja: 'MSDx Winter (Design Studio Gamma, Digital Design)', title_en: 'MSDx Winter (Design Studio Gamma, Digital Design)'}, {title_ja: 'MSDx Summer (Design Studio Delta)', title_en: 'MSDx Summer (Design Studio Delta)'}]},
      {year: '2026', items_ja: [{title_ja: 'スケッチがArchitects’ Journalに掲載', title_en: 'Sketch featured in Architects’ journal', url: 'https://www.architectsjournal.co.uk/news/sketchbook-hana-murakami'}], items_en: [{title_ja: 'スケッチがArchitects’ Journalに掲載', title_en: 'Sketch featured in Architects’ journal', url: 'https://www.architectsjournal.co.uk/news/sketchbook-hana-murakami'}]},
    ],
    skills_heading_ja: 'スキル', skills_heading_en: 'Skills',
    skills: [],
    philosophy_heading_ja: 'フィロソフィー', philosophy_heading_en: 'Philosophy',
    philosophy_ja: [],
    philosophy_en: [],
    signature: 'HANA MURAKAMI',
  },
  preview: {prepare: () => ({title: 'Designer Profile', subtitle: 'About page content'})},
})

export const designerProfileTypes = [timelineEntry, featuredItem, featuredEntry, skillGroup, designerProfile]
