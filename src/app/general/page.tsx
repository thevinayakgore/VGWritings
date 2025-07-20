"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FiPlus,
  FiSearch,
  FiClock,
  FiHeart,
  FiCalendar,
  FiMessageCircle,
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { PortableTextBlock } from "@portabletext/types";

type SanityImage = {
  asset: {
    _ref: string;
    _type: string;
  };
};

type GeneralPost = {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  category?: string;
  desc?: string;
  readingTime?: number;
  coverImage?: SanityImage;
  views?: number;
  likes?: number;
  comments?: number;
  tags: string[];
  content?: Array<
    | PortableTextBlock
    | {
        _type: "code";
        code: string;
        language?: string;
        filename?: string;
      }
    | {
        _type: "video";
        file?: { asset?: { url?: string } };
        poster?: { asset?: { url?: string } };
      }
  >;
};

export default function GeneralBlogs() {
  const [posts, setPosts] = useState<GeneralPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await client.fetch(
        `*[_type == "general"] | order(date desc){
          _id,
          title,
          slug,
          date,
          desc,
          category,
          readingTime,
          coverImage,
          views,
          likes,
          comments,
          tags,
          content[]{
            ...,
            file{ asset->{ url } },
            poster{ asset->{ url } }
          }
        }`
      );
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const filteredBlogs = posts.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(query.length > 0);

    if (query.length > 2) {
      const results = posts.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query.toLowerCase()) ||
          (blog.desc?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
          blog.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      );

      if (results.length === 0) {
        toast.error(`No blogs found matching "${query}"`);
      }
    }
  };

  return (
    <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <h1 className="logo text-4xl md:text-5xl font-bold pb-5">
          General Blogs
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore the latest articles on web development, design, and modern
          technologies
        </p>
      </motion.div>

      {/* Search and Add Blog */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row items-center relative mb-12 max-w-3xl mx-auto w-full"
      >
        <div className="w-full">
          <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 size-7 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search blogs by title, description or tags..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-16 py-8 xl:text-xl placeholder:text-xl rounded-full w-full"
          />
        </div>
        <Link href="/blogs/add" className="absolute right-0">
          <Button size="icon" className="p-8 hover:shadow-md rounded-full">
            <FiPlus className="size-7" />
          </Button>
        </Link>
      </motion.div>

      {/* Blog Grid */}
      {filteredBlogs && (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.06 }}
                layout
            >
              <Link href={`/general/${blog.slug.current}`}>
                <Card className="h-full flex flex-col overflow-hidden pt-0 group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-video border-b overflow-hidden min-h-60">
                    {blog.coverImage && (
                      <Image
                        src={urlFor(blog.coverImage).url()}
                        alt={blog.title}
                        width={2000}
                        height={2000}
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-500 h-full"
                      />
                    )}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {blog.category && (
                        <Badge className="text-xs md:text-sm px-3 py-1 rounded-sm bg-blue-500 text-white">
                          {blog.category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2">
                      {blog.title}
                    </CardTitle>
                    {/* Tags after title */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 mb-1">
                        {blog.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs md:text-sm px-3 py-1.5 leading-none rounded-full"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-col items-start gap-2 mt-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="h-4 w-4" />
                        <span>{new Date(blog.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock className="h-4 w-4" />
                        <span>
                          {blog.readingTime
                            ? `${blog.readingTime} min read`
                            : ""}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <p className="line-clamp-3 opacity-60">
                      {blog.desc && blog.desc.length > 100
                        ? blog.desc + "..."
                        : blog.desc}
                    </p>
                  </CardContent>

                  <CardFooter className="flex justify-between items-center border-t pt-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FiMessageCircle className="h-4 w-4" />
                        <span>{blog.comments ?? 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiHeart className="h-4 w-4" />
                        <span>{blog.likes ?? 0}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}
