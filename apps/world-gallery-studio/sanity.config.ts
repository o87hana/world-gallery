import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

// ここを明示的に index まで書く
import {schemaTypes} from './schemaTypes/index'

export default defineConfig({
  name: 'default',
  title: 'world-gallery-studio',

  projectId: 'kmx5m7v5',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) => S.list().title('Content').items([
        S.documentTypeListItem('work').title('Work'),
        S.listItem()
          .title('Designer Profile')
          .child(S.document().schemaType('designerProfile').documentId('designerProfile').title('Designer Profile')),
      ]),
    }),
    presentationTool({
      previewUrl: {
        initial: process.env.SANITY_STUDIO_PREVIEW_URL || 'https://world-gallery-hana-murakamis-projects.vercel.app',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
          shareAccess: true,
        },
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
