// schemaTypes/work.ts
import {defineField, defineType} from 'sanity'

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
    }),

    defineField({
      name: 'body',
      title: 'Text (about 500 words)',
      type: 'array',
      of: [{type: 'block'}],
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
