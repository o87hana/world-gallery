import {createReadStream} from 'node:fs'
import process from 'node:process'
import {Console} from 'node:console'
import {fileURLToPath, URL} from 'node:url'
import {createClient} from '@sanity/client'

const console = new Console({stdout: process.stdout, stderr: process.stderr})

const PROJECT_ID = 'kmx5m7v5'
const DATASET = 'production'
const API_VERSION = '2025-12-19'
const SAMPLE_IMAGE_FILENAME = 'world-gallery-sample.avif'
const SAMPLE_IMAGE_PATH = fileURLToPath(
  new URL('../../web/public/designerphoto.avif', import.meta.url),
)
const shouldWrite = process.argv.includes('--write')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (projectId !== PROJECT_ID || dataset !== DATASET) {
  throw new Error(`Refusing to seed unexpected target: ${projectId || '(missing)'}/${dataset || '(missing)'}`)
}

const portableText = (key, text) => [
  {
    _key: key,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{_key: `${key}-span`, _type: 'span', marks: [], text}],
  },
]

const textBlock = (key, ja, en) => ({
  _key: key,
  _type: 'textBlock',
  body_ja: portableText(`${key}-ja`, ja),
  body_en: portableText(`${key}-en`, en),
})

const image = (assetId, alt) => ({
  _type: 'image',
  asset: {_ref: assetId, _type: 'reference'},
  alt,
})

const imageBlock = (key, assetId, widthPreset, captionJa, captionEn) => ({
  _key: key,
  _type: 'imageBlock',
  image: image(assetId, captionEn),
  caption_ja: captionJa,
  caption_en: captionEn,
  widthPreset,
})

const imageGridBlock = (key, assetId, columns = 2) => ({
  _key: key,
  _type: 'imageGridBlock',
  columns,
  gap: 'medium',
  images: [
    {
      ...image(assetId, 'First study image'),
      _key: `${key}-1`,
      caption_ja: 'スタディ画像 1',
      caption_en: 'Study image 1',
    },
    {
      ...image(assetId, 'Second study image'),
      _key: `${key}-2`,
      caption_ja: 'スタディ画像 2',
      caption_en: 'Study image 2',
    },
  ],
})

const sampleDefinitions = [
  {
    id: 'sample-tokyo-sketch',
    slug: 'tokyo-observation-sketch',
    category: 'Sketch',
    titleJa: '東京・観察のスケッチ',
    titleEn: 'Tokyo Observation Sketch',
    subtitleJa: '都市の動きを線で記録する',
    subtitleEn: 'Recording urban movement through line',
    date: '2026-08-01T09:00:00.000Z',
    location: {lat: 35.6762, lng: 139.6503, placeName_ja: '東京', placeName_en: 'Tokyo'},
    tags: ['sketch', 'urban', 'Tokyo'],
    blocks: (assetId) => [
      textBlock(
        'tokyo-text',
        '交差点を行き交う人と建物の輪郭を、短い線の連なりとして記録した作品です。',
        'This work records people and buildings at a crossing as a sequence of quick lines.',
      ),
      imageBlock('tokyo-image', assetId, 'narrow', '東京での観察記録', 'Observation recorded in Tokyo'),
      {_key: 'tokyo-spacer', _type: 'spacer', size: 'm'},
      {_key: 'tokyo-divider', _type: 'divider', style: 'solid'},
    ],
  },
  {
    id: 'sample-london-architecture',
    slug: 'london-structural-rhythm',
    category: 'Architecture',
    titleJa: 'ロンドン・構造のリズム',
    titleEn: 'London Structural Rhythm',
    subtitleJa: '反復する立面と光の研究',
    subtitleEn: 'A study of repeating facades and light',
    date: '2026-07-15T09:00:00.000Z',
    location: {lat: 51.5072, lng: -0.1276, placeName_ja: 'ロンドン', placeName_en: 'London'},
    tags: ['architecture', 'facade', 'London'],
    blocks: (assetId) => [
      textBlock(
        'london-text',
        '立面に現れる反復と陰影から、街路に固有のリズムを読み取ります。',
        'Repetition and shadow across the facade reveal a rhythm specific to the street.',
      ),
      imageGridBlock('london-grid', assetId, 2),
    ],
  },
  {
    id: 'sample-reykjavik-travel',
    slug: 'reykjavik-light-notes',
    category: 'Travel',
    titleJa: 'レイキャビク・光のノート',
    titleEn: 'Reykjavik Light Notes',
    subtitleJa: '移動のなかで変化する色を集める',
    subtitleEn: 'Collecting changing colors while traveling',
    date: '2026-06-20T09:00:00.000Z',
    location: {lat: 64.1466, lng: -21.9426, placeName_ja: 'レイキャビク', placeName_en: 'Reykjavik'},
    tags: ['travel', 'light', 'Iceland'],
    blocks: (assetId) => [
      imageBlock('reykjavik-image', assetId, 'full', '北の光の記録', 'A record of northern light'),
      textBlock(
        'reykjavik-text',
        '天候と時間によって変わる光を、旅の順序に沿って構成しています。',
        'Changing light is arranged according to the sequence of the journey.',
      ),
    ],
  },
  {
    id: 'sample-nairobi-research',
    slug: 'nairobi-material-study',
    category: 'Research',
    titleJa: 'ナイロビ・素材研究',
    titleEn: 'Nairobi Material Study',
    subtitleJa: '表面、色、使われ方のフィールドノート',
    subtitleEn: 'Field notes on surfaces, color, and use',
    date: '2026-05-08T09:00:00.000Z',
    location: {lat: -1.2921, lng: 36.8219, placeName_ja: 'ナイロビ', placeName_en: 'Nairobi'},
    tags: ['research', 'material', 'Nairobi'],
    blocks: (assetId) => [
      textBlock(
        'nairobi-text',
        '現地で見つけた素材を、触感と使われ方の関係から比較しました。',
        'Materials found on site are compared through the relationship between texture and use.',
      ),
      imageGridBlock('nairobi-grid', assetId, 3),
      {_key: 'nairobi-divider', _type: 'divider', style: 'dashed'},
    ],
  },
  {
    id: 'drafts.sample-private-other',
    slug: 'private-work-in-progress',
    category: 'Other',
    titleJa: '制作中の非公開作品',
    titleEn: 'Private Work in Progress',
    subtitleJa: 'Preview Mode検証用',
    subtitleEn: 'Preview Mode acceptance fixture',
    date: '2026-08-19T09:00:00.000Z',
    location: {lat: 35.4437, lng: 139.638, placeName_ja: '横浜', placeName_en: 'Yokohama'},
    tags: ['preview', 'draft', 'acceptance-test'],
    published: false,
    blocks: (assetId) => [
      textBlock(
        'private-text',
        'この作品は一般公開されず、Preview Modeでのみ確認するための検証データです。',
        'This work is hidden publicly and exists only to verify Preview Mode.',
      ),
      imageBlock('private-image', assetId, 'medium', '非公開画像', 'Private preview image'),
      imageGridBlock('private-grid', assetId, 2),
      {_key: 'private-spacer', _type: 'spacer', size: 's'},
      {_key: 'private-divider', _type: 'divider', style: 'solid'},
    ],
  },
]

const sampleIds = new Set(sampleDefinitions.map(({id}) => id))

if (!shouldWrite) {
  console.log(`Dry run: ${sampleDefinitions.length} works -> ${PROJECT_ID}/${DATASET}`)
  for (const sample of sampleDefinitions) {
    console.log(`- ${sample.id}: ${sample.category} / ${sample.slug}`)
  }
  console.log('No remote data was changed. Re-run with --write to apply.')
  process.exit(0)
}

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) throw new Error('SANITY_API_WRITE_TOKEN is required with --write')

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
})

const existingWorks = await client.fetch('*[_type == "work"]{_id}')
const unexpectedWorks = existingWorks.filter(({_id}) => !sampleIds.has(_id))
if (unexpectedWorks.length > 0) {
  throw new Error(`Refusing to seed a non-empty dataset (${unexpectedWorks.length} non-sample works found)`)
}

let asset = await client.fetch(
  '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}',
  {filename: SAMPLE_IMAGE_FILENAME},
)

if (!asset) {
  asset = await client.assets.upload('image', createReadStream(SAMPLE_IMAGE_PATH), {
    filename: SAMPLE_IMAGE_FILENAME,
  })
}

let transaction = client.transaction()
for (const sample of sampleDefinitions) {
  transaction = transaction.createOrReplace({
    _id: sample.id,
    _type: 'work',
    title_ja: sample.titleJa,
    title_en: sample.titleEn,
    subtitle_ja: sample.subtitleJa,
    subtitle_en: sample.subtitleEn,
    slug: {_type: 'slug', current: sample.slug},
    category: sample.category,
    published: sample.published ?? true,
    date: sample.date,
    location: sample.location,
    coverImage: image(asset._id, sample.titleEn),
    tags: sample.tags,
    blocks: sample.blocks(asset._id),
  })
}

await transaction.commit({visibility: 'sync'})
console.log(`Seeded ${sampleDefinitions.length} works using asset ${asset._id}`)
