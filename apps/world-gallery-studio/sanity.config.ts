import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

// ここを明示的に index まで書く
import {schemaTypes} from './schemaTypes/index'

export default defineConfig({
  name: 'default',
  title: 'world-gallery-studio',

  projectId: '0r4dx2l1',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
