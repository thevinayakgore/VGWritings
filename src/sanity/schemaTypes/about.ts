import { defineField, defineType } from "sanity";

export default defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
        },
      ],
    }),
    defineField({
      name: "features",
      title: "Features List",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "firstBtn",
      title: "1st Button",
      type: "string",
    }),
    defineField({
      name: "secondBtn",
      title: "2nd Button",
      type: "string",
    }),
  ],
});
