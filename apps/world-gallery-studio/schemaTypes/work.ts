// schemaTypes/work.ts
import {defineField, defineType} from 'sanity'

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
          ],
        }),
      ],
      validation: (Rule) => Rule.min(1),
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
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(120),
    }),

    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Sketch', value: 'sketch'},
          {title: 'Architecture', value: 'architecture'},
          {title: 'Travel', value: 'travel'},
          {title: 'Research', value: 'research'},
          {title: 'Other', value: 'other'},
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
      ],
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
    }),

    defineField({
      name: 'blocks',
      title: 'Content Blocks',
      type: 'array',
      of: [{type: 'block'}, {type: 'imageBlock'}, {type: 'imageGridBlock'}, {type: 'spacer'}, {type: 'divider'}],
      description: 'テキスト/画像/グリッドを自由に並べて構成できます',
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
          ],
        }),
      ],
      options: {sortable: true},
      description: '旧: 互換用（Content Blocks を推奨）',
    }),

    defineField({
      name: 'body',
      title: 'Text (about 500 words)',
      type: 'array',
      of: [{type: 'block'}],
      description: '旧: 互換用（Content Blocks を推奨）',
    }),

    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
      category: 'category',
      published: 'published',
    },
    prepare(selection) {
      const {title, media, category, published} = selection as any
      return {
        title,
        media,
        subtitle: `${category ?? '—'} ${published ? '' : ' • (Unpublished)'}`,
      }
    },
  },
})
