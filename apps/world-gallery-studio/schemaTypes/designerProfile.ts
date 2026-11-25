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

const featuredEntry = defineType({
  name: 'designerFeaturedEntry',
  title: 'Featured entry',
  type: 'object',
  fields: [
    defineField({name: 'year', title: 'Year', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'items_ja', title: 'Items (Japanese)', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'items_en', title: 'Items (English)', type: 'array', of: [{type: 'string'}]}),
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
      {year: '2000', text_ja: '日本生まれ', text_en: 'Born in Japan'},
      {year: '2018', text_ja: '留学生としてオーストラリアへ移住', text_en: 'Moved to Australia as an international student'},
      {year: '2019', text_ja: 'メルボルン大学 Bachelor of Designにて、建築学を専攻', text_en: 'Began studying architecture at the University of Melbourne, completing a Bachelor of Design with a major in Architecture'},
      {year: '2023', text_ja: '同大学を卒業。すべての建築設計スタジオ科目でFirst Class Honours（H1）を取得', text_en: 'Graduated from the University of Melbourne with First Class Honours (H1) in every architecture studio subject'},
    ],
    featured_heading_ja: '主な選出歴', featured_heading_en: 'Featured',
    featured: [
      {year: '2020', items_ja: ['MSDx Summer (FoDR)'], items_en: ['MSDx Summer (FoDR)']},
      {year: '2021', items_ja: ['MSDx Winter (Design Studio Alpha)', 'MSDx Summer (Design Studio Beta)'], items_en: ['MSDx Winter (Design Studio Alpha)', 'MSDx Summer (Design Studio Beta)']},
      {year: '2022', items_ja: ['MSDx Winter (Design Studio Gamma, Digital Design)', 'MSDx Summer (Design Studio Delta)'], items_en: ['MSDx Winter (Design Studio Gamma, Digital Design)', 'MSDx Summer (Design Studio Delta)']},
    ],
    skills_heading_ja: 'スキル', skills_heading_en: 'Skills',
    skills: [
      {experience_ja: '3年以上', experience_en: '3+ years', items_ja: ['Rhinoceros', 'Adobe InDesign', 'Adobe Illustrator', 'Adobe Photoshop', 'Google Sheets', 'Microsoft Office (Word, Excel, PowerPoint)', 'Wix'], items_en: ['Rhinoceros', 'Adobe InDesign', 'Adobe Illustrator', 'Adobe Photoshop', 'Google Sheets', 'Microsoft Office (Word, Excel, PowerPoint)', 'Wix']},
      {experience_ja: '2年以上', experience_en: '2+ years', items_ja: ['Adobe Premiere', 'Grasshopper', 'Twinmotion'], items_en: ['Adobe Premiere', 'Grasshopper', 'Twinmotion']},
      {experience_ja: '1年未満', experience_en: '0–1 year', items_ja: ['AutoCAD', 'Archicad'], items_en: ['AutoCAD', 'Archicad']},
    ],
    philosophy_heading_ja: 'フィロソフィー', philosophy_heading_en: 'Philosophy',
    philosophy_ja: [
      '詩を書くように、建築をデザインしたい。',
      '私のデザインが、生涯にわたって誰かを支え続けるものであってほしい。心に永く残り、必要なときに私たちを救ってくれる美しい詩のような、やさしい言葉を思わせる建築をつくりたいと考えています。',
      '人類の歴史は、いつも成功と発展だけで築かれてきたわけではありません。人生には、悲しみや苦しみに満ちた瞬間があります。私たちは常に前へ進み、より良く変わり続けられるとは限りません。だからこそ、多くの人の人生をそっと包み込み、ともに歩む建築をデザインしたいと思います。',
      '痛みの中にいるとき、その痛みをきちんと感じられるように。',
      '幸せなとき、その幸せを感じられるように。',
      '誰もが偽りなく、正直な自分でいられるように。',
      'それを可能にするのは、どのような空間でしょうか。',
      '人が人であり続けるために。',
      '哲学が永遠に存在し続けるために。',
      '人の感情を建築空間に映すことで、私たちは空間と一つになれます。それによって、自分の居場所を愛おしく思い、自分自身を愛し、より良い人生へとつながっていくのだと信じています。',
    ],
    philosophy_en: [
      'I want to design architecture as if I were writing a poem.',
      "I would like my design to keep supporting someone throughout their life. I want to create architecture like gentle words—a beautiful poem that stays in one's mind forever and saves us when needed.",
      "Human history has not always been about success and development. During our lives, there are moments full of sorrow and suffering. We may not always move forward or continue changing for the better. I would like to design architecture that gently embraces people's lives and walks alongside them.",
      'I want people to feel their pain when they are in pain.',
      'I want people to feel happiness when they are happy.',
      'I want people to be their genuine and honest selves.',
      'What kind of space makes this possible?',
      'For humans to remain human.',
      'For philosophy to exist forever.',
      'Reflecting human emotions in architectural space allows us to merge with that space. I believe this helps us cherish the places where we belong, and leads us to love ourselves and live better lives.',
    ],
    signature: 'HANA MURAKAMI',
  },
  preview: {prepare: () => ({title: 'Designer Profile', subtitle: 'About page content'})},
})

export const designerProfileTypes = [timelineEntry, featuredEntry, skillGroup, designerProfile]
