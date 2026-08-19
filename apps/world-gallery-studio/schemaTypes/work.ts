// schemaTypes/work.ts
import {defineField, defineType} from 'sanity'

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text',
  type: 'object',
  fields: [
    defineField({
      name: 'body_ja',
      title: 'Body (Japanese)',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'body_en',
      title: 'Body (English)',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      const block = value as {body_ja?: unknown[]; body_en?: unknown[]} | undefined
      return block?.body_ja?.length || block?.body_en?.length
        ? true
        : 'Enter body text in at least one language'
    }),
  preview: {
    select: {bodyJa: 'body_ja', bodyEn: 'body_en'},
    prepare({bodyJa, bodyEn}) {
      const languages = [bodyJa?.length ? 'JA' : null, bodyEn?.length ? 'EN' : null]
        .filter(Boolean)
        .join(' / ')
      return {title: 'Text', subtitle: languages || 'Empty'}
    },
  },
})

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt', type: 'string'}),
        defineField({name: 'caption', title: 'Caption', type: 'string'}),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption_ja',
      title: 'Caption (Japanese)',
      type: 'string',
    }),
    defineField({
      name: 'caption_en',
      title: 'Caption (English)',
      type: 'string',
    }),
    defineField({
      name: 'widthPreset',
      title: 'Width',
      type: 'string',
      options: {
        list: [
          {title: 'Full', value: 'full'},
          {title: 'Medium', value: 'medium'},
          {title: 'Narrow', value: 'narrow'},
        ],
        layout: 'radio',
      },
      initialValue: 'full',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {media: 'image', title: 'image.caption'},
    prepare({media, title}) {
      return {media, title: title ?? 'Image'}
    },
  },
})

export const imageGridBlock = defineType({
  name: 'imageGridBlock',
  title: 'Image Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineField({
          name: 'gridImage',
          title: 'Image',
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Alt', type: 'string'}),
            defineField({name: 'caption', title: 'Caption', type: 'string'}),
            defineField({name: 'caption_ja', title: 'Caption (Japanese)', type: 'string'}),
            defineField({name: 'caption_en', title: 'Caption (English)', type: 'string'}),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [
          {title: '1', value: 1},
          {title: '2', value: 2},
          {title: '3', value: 3},
          {title: '4', value: 4},
        ],
        layout: 'radio',
      },
      initialValue: 2,
      validation: (Rule) => Rule.required().integer().min(1).max(4),
    }),
    defineField({
      name: 'gap',
      title: 'Gap',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'columns', media: 'images.0'},
    prepare({title, media}) {
      return {media, title: `Image Grid (${title ?? 2} cols)`}
    },
  },
})

export const spacer = defineType({
  name: 'spacer',
  title: 'Spacer',
  type: 'object',
  fields: [
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          {title: 'S', value: 's'},
          {title: 'M', value: 'm'},
          {title: 'L', value: 'l'},
        ],
        layout: 'radio',
      },
      initialValue: 'm',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'size'},
    prepare({title}) {
      return {title: `Spacer (${title ?? 'm'})`}
    },
  },
})

export const divider = defineType({
  name: 'divider',
  title: 'Divider',
  type: 'object',
  fields: [
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          {title: 'Solid', value: 'solid'},
          {title: 'Dashed', value: 'dashed'},
        ],
        layout: 'radio',
      },
      initialValue: 'solid',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'style'},
    prepare({title}) {
      return {title: `Divider (${title ?? 'solid'})`}
    },
  },
})

export const work = defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  fields: [
    defineField({
      name: 'title_ja',
      title: 'Title (Japanese)',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'subtitle_ja',
      title: 'Subtitle (Japanese)',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'subtitle_en',
      title: 'Subtitle (English)',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),

    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title_ja', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Sketch', value: 'Sketch'},
          {title: 'Architecture', value: 'Architecture'},
          {title: 'Travel', value: 'Travel'},
          {title: 'Research', value: 'Research'},
          {title: 'Other', value: 'Other'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
      description: 'OFFにすると非公開（プレビューのみ）',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'location',
      title: 'Location (Lat/Lng)',
      type: 'object',
      fields: [
        defineField({
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          validation: (Rule) => Rule.required().min(-90).max(90),
        }),
        defineField({
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          validation: (Rule) => Rule.required().min(-180).max(180),
        }),
        defineField({
          name: 'placeName_ja',
          title: 'Place Name (Japanese)',
          type: 'string',
        }),
        defineField({
          name: 'placeName_en',
          title: 'Place Name (English)',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero Image (Legacy)',
      type: 'image',
      options: {hotspot: true},
      description: '旧: 互換用（Cover Image を推奨）',
    }),

    defineField({
      name: 'blocks',
      title: 'Content Blocks',
      type: 'array',
      of: [
        {type: 'textBlock'},
        {type: 'block'},
        {type: 'imageBlock'},
        {type: 'imageGridBlock'},
        {type: 'spacer'},
        {type: 'divider'},
      ],
      options: {sortable: true},
      description: 'テキスト/画像/グリッドを自由に並べて構成できます',
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: '作品の日付（表示・並び替え用）',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string', validation: (Rule) => Rule.min(1).max(60)}],
      options: {layout: 'tags'},
      validation: (Rule) => Rule.unique().max(20),
    }),

    defineField({
      name: 'gallery',
      title: 'Gallery Images (15± / work)',
      type: 'array',
      of: [
        defineField({
          name: 'galleryImage',
          title: 'Image',
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Alt', type: 'string'}),
            defineField({name: 'caption', title: 'Caption', type: 'string'}),
            defineField({name: 'caption_ja', title: 'Caption (Japanese)', type: 'string'}),
            defineField({name: 'caption_en', title: 'Caption (English)', type: 'string'}),
          ],
        }),
      ],
      options: {sortable: true},
      description: '旧: 互換用（Content Blocks を推奨）',
    }),

    defineField({
      name: 'body',
      title: 'Text (Legacy)',
      type: 'array',
      of: [{type: 'block'}],
      description: '旧: 互換用（Content Blocks を推奨）',
    }),

    defineField({
      name: 'title',
      title: 'Title (Legacy)',
      type: 'string',
      description: '旧: 互換用（Title (Japanese) / Title (English) を推奨）',
    }),

    defineField({
      name: 'createdAt',
      title: 'Created At (Legacy)',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      description: '旧: 互換用（Date を推奨）',
    }),
  ],

  preview: {
    select: {
      titleJa: 'title_ja',
      titleLegacy: 'title',
      media: 'coverImage',
      legacyMedia: 'heroImage',
      category: 'category',
      published: 'published',
    },
    prepare({titleJa, titleLegacy, media, legacyMedia, category, published}) {
      return {
        title: titleJa ?? titleLegacy ?? 'Untitled',
        media: media ?? legacyMedia,
        subtitle: `${category ?? '—'} ${published ? '' : ' • (Unpublished)'}`,
      }
    },
  },
})
