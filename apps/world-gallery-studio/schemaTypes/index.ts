// schemaTypes/index.ts
import {divider, imageBlock, imageGridBlock, spacer, textBlock, work} from './work'
import {designerProfileTypes} from './designerProfile'

export const schemaTypes = [work, ...designerProfileTypes, textBlock, imageBlock, imageGridBlock, spacer, divider]
