import { defineField, defineType } from "sanity";

export default defineType({
  name: "learning",
  title: "Learning",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({ name: "date", title: "Date", type: "datetime" }),
    defineField({ name: "readingTime", title: "Reading Time", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "keyMomentsData",
      title: "Key Moments",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            },
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 1", value: "h1" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
            { title: "Heading 5", value: "h5" },
            { title: "Divider", value: "hr" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
            { title: "Square", value: "square" },
            { title: "Circle", value: "circle" },
            { title: "Alphabet", value: "alpha" },
            { title: "Roman", value: "roman" },
          ],
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              title: "Attribution",
              name: "attribution",
              type: "string",
            },
          ],
        },
        {
          type: "code",
          options: {
            language: [
              { title: "C", value: "c" },
              { title: "C++", value: "cpp" },
              // You can add more languages here as needed
              { title: "JavaScript", value: "javascript" },
              { title: "TypeScript", value: "typescript" },
              { title: "Python", value: "python" },
              // ...other languages...
            ],
          },
        },
        {
          type: "object",
          name: "video",
          title: "Video Upload",
          fields: [
            {
              name: "file",
              type: "file",
              title: "Video File",
              options: {
                accept: "video/mp4,video/x-m4v,video/*",
              },
            },
            {
              name: "poster",
              type: "image",
              title: "Poster Image",
              description: "Optional thumbnail to show before video plays",
            },
          ],
          preview: {
            select: { file: "file", poster: "poster" },
            prepare({ file, poster }) {
              return {
                title: "Video",
                subtitle: file?.asset?._ref,
                media: poster,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "object",
      fields: [
        { name: "likes", title: "Likes", type: "number", initialValue: 0 },
        { name: "views", title: "Views", type: "number", initialValue: 0 },
      ],
    }),
  ],
});
