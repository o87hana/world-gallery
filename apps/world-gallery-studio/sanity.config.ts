import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

// ここを明示的に index まで書く
import {schemaTypes} from './schemaTypes/index'

export default defineConfig({
  name: 'default',
  title: 'world-gallery-studio',

  projectId: 'kmx5m7v5',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
