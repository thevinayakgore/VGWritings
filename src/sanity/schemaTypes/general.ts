import { defineField, defineType } from "sanity";

export default defineType({
  name: "general",
  title: "General Blogs",
  type: "document",
  fields: [
    defineField({
      title: "Title",
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: "Slug",
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
    }),
    defineField({
      title: "Short Description",
      name: "desc",
      type: "string",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      title: "Cover Image",
      name: "coverImage",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      title: "Estimated Reading Time (minutes)",
      name: "readingTime",
      type: "number",
      description: "Estimated reading time in minutes.",
    }),
    defineField({
      title: "Comments Count",
      name: "comments",
      type: "number",
      description: "Number of comments on the blog post.",
    }),
    defineField({
      title: "Like Count",
      name: "likes",
      type: "number",
      description: "Number of likes on the blog post.",
    }),
    defineField({
      title: "Category",
      name: "category",
      type: "string",
      description: "Category of the blog post.",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
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
        {
          type: "object",
          name: "keyMoments",
          title: "Key Moments",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
            },
            {
              name: "description",
              type: "text",
              title: "Description",
            },
            {
              name: "image",
              type: "image",
              title: "Image",
              options: { hotspot: true },
            },
          ],
          preview: {
            select: { title: "title", media: "image" },
            prepare({ title, media }) {
              return {
                title: title || "Key Moment",
                media,
              };
            },
          },
        },
      ],
    }),
  ],
});
