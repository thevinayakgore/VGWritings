"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FiHeart,
  FiBookmark,
  FiShare2,
  FiCalendar,
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "sonner";
import TableOfContents, { TocItem } from "@/components/TableOfContents";
import NewsletterSignup from "@/components/NewsletterSignup";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { PortableTextBlock } from "@portabletext/types";
import VideoPlayer from "@/components/VideoPlayer";

// Define a minimal SanityImage type
interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: string };
}

// Define the type for a learning post based on the schema
type KeyMoment = {
  image?: SanityImage;
  title?: string;
  description?: string;
};

type LearningPost = {
  _id: string;
  title: string;
  category: string;
  date: string;
  readingTime: string;
  slug: { current: string };
  tags: string[];
  keyMomentsData?: KeyMoment[];
  highlights?: string[];
  content: PortableTextBlock[];
  summary?: string;
  stats?: { likes?: number; views?: number };
  cover?: SanityImage;
};

type LinkMark = { href?: string };

export default function Page() {
  const [post, setPost] = useState<LearningPost | null>(null);
  const { slug } = useParams();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(42);
  const [bookmarked, setBookmarked] = useState(false);
  const [showFloatingActions, setShowFloatingActions] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      const data = await client.fetch(
        `*[_type == "learning" && slug.current == $slug][0]{
          _id,
          title,
          category,
          date,
          readingTime,
          slug,
          tags,
          keyMomentsData,
          highlights,
          content[]{
            ...,
            file{
              asset->{
                url
              }
            },
            poster{
              asset->{
                url
              }
            }
          },
          summary,
          stats,
          cover
        }`,
        { slug }
      );
      setPost(data);
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    // Extract headings from PortableText for TOC
    if (post?.content) {
      const headings: TocItem[] = [];
      post.content.forEach((block) => {
        if (
          block._type === "block" &&
          block.style &&
          block.children &&
          ["h1", "h2", "h3", "h4", "h5", "h6"].includes(block.style)
        ) {
          headings.push({
            id: String(block._key),
            text: (block.children as { text: string }[])
              .map((c) => c.text)
              .join(" "),
            level: Number((block.style as string).replace("h", "")) || 1,
          });
        }
      });
      setTocItems(headings);
    }
  }, [slug, post?.content]);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingActions(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!post)
    return <div className="py-20 px-4 text-center">Post not found</div>;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    toast.success(liked ? "Removed like" : "Liked post");
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const portableTextComponents: PortableTextComponents = {
    block: {
      h1: (props: { children?: React.ReactNode }) => (
        <h1 className="text-3xl md:text-5xl md:font-medium underline underline-offset-10 decoration-double decoration-2 decoration-muted-foreground/30 my-5">
          {props.children}
        </h1>
      ),
      h2: (props: { children?: React.ReactNode }) => (
        <h2 className="text-xl md:text-3xl md:font-medium underline underline-offset-10 decoration-double decoration-2 decoration-muted-foreground/30 my-4">
          {props.children}
        </h2>
      ),
      h3: (props: { children?: React.ReactNode }) => (
        <h3 className="text-lg md:text-2xl md:font-medium underline underline-offset-10 decoration-double decoration-2 decoration-muted-foreground/30 my-3">
          {props.children}
        </h3>
      ),
      h4: (props: { children?: React.ReactNode }) => (
        <h4 className="text-base md:text-xl md:font-medium my-2">
          {props.children}
        </h4>
      ),
      h5: (props: { children?: React.ReactNode }) => (
        <h5 className="text-xs md:text-base text-white py-1 rounded md:rounded-md bg-yellow-500/[0.3] whitespace-nowrap overflow-x-auto opacity-50 w-full">
          <span className="sticky left-0 z-20 p-1 md:py-2 px-1.5 md:px-3 rounded md:rounded-md rounded-r-none bg-gradient-to-r from-yellow-500 to-yellow-400">
            ✦
          </span>
          <span className="p-2">{props.children}</span>
        </h5>
      ),
      normal: (props: { children?: React.ReactNode }) => (
        <p className="text-sm md:text-lg text-muted-foreground leading-relaxed my-4">
          {props.children}
        </p>
      ),
      hr: () => <hr className="my-5 mdmy-10 lg:my-16 border-t" />,
    },
    list: {
      bullet: (props: { children?: React.ReactNode }) => (
        <ul className="list-none text-xs leading-5 md:leading-7 md:text-base my-5 p-5 bg-foreground/5 rounded-lg opacity-90">
          {props.children}
        </ul>
      ),
      number: (props: { children?: React.ReactNode }) => (
        <ol className="list-decimal pl-5 text-xs leading-5 md:leading-7 md:text-base my-2">
          {props.children}
        </ol>
      ),
      square: (props: { children?: React.ReactNode }) => (
        <ul className="list-square pl-5 text-purple-500 my-2">
          {props.children}
        </ul>
      ),
      circle: (props: { children?: React.ReactNode }) => (
        <ul className="list-circle pl-5 text-green-400 my-2">
          {props.children}
        </ul>
      ),
      alpha: (props: { children?: React.ReactNode }) => (
        <ol className="list-[lower-alpha] pl-5 text-pink-400 my-2">
          {props.children}
        </ol>
      ),
      roman: (props: { children?: React.ReactNode }) => (
        <ol className="list-[upper-roman] pl-5 text-red-400 my-2">
          {props.children}
        </ol>
      ),
    },
    listItem: {
      bullet: (props: { children?: React.ReactNode }) => (
        <li className="flex items-center gap-3">
          <FiCheckCircle />
          {props.children}
        </li>
      ),
    },
    marks: {
      link: (props: { children?: React.ReactNode; value?: LinkMark }) => {
        const target = props.value?.href?.startsWith("http")
          ? "_blank"
          : undefined;
        return (
          <Link
            href={props.value?.href || "#"}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className="text-blue-600 hover:text-green-500"
          >
            {props.children}
          </Link>
        );
      },
    },
    types: {
      code: ({ value }) => (
        <CodeBlock code={value.code} language={value.language} />
      ),
      video: ({ value }) =>
        value.file?.asset?.url ? (
          <VideoPlayer
            src={value.file.asset.url}
            poster={value.poster?.asset?.url}
          />
        ) : null,
    },
  };

  return (
    <>
      {/* ReadingProgressBar can be added here if desired */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center px-4 sm:px-10 lg:px-20 m-auto w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 container justify-center m-auto gap-16 mt-3 w-full">
          {/* Table of Contents - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 pb-5">
              <motion.div whileHover={{ x: -5 }} className="py-3">
                <Link href="/learning">
                  <Button className="p-7 text-sm md:text-base w-full">
                    <FiArrowLeft className="size-5 mr-2" />
                    Back to blogs
                  </Button>
                </Link>
              </motion.div>
              <TableOfContents items={tocItems} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Article Header */}
              <header className="pb-6 md:pb-10 border-b">
                <Badge
                  variant="outline"
                  className="flex md:inline-flex flex-wrap items-center justify-start md:gap-2 p-3 mb-3 md:mb-6 overflow-auto w-full md:w-auto"
                >
                  <span className="rounded-full text-base md:text-lg leading-none font-bold pr-2 md:px-3">
                    ► TAGS
                  </span>
                  {post.tags.map((item) => (
                    <Badge
                      key={item}
                      className="bg-primary text-xs md:text-sm p-1 px-3 md:px-4 rounded-full"
                    >
                      {item}
                    </Badge>
                  ))}
                </Badge>
                <h1 className="logo text-xl md:text-4xl lg:text-5xl tracking-wide mb-3">
                  {post.title}
                </h1>
                {post.summary && (
                  <p className="text-sm md:text-lg text-muted-foreground mb-3">
                    {post.summary}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="size-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  {post.readingTime && (
                    <div className="flex items-center gap-2">
                      <FiClock className="size-4" />
                      <span>{post.readingTime}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FiHeart className="size-4" />
                    <span>{likes} Likes</span>
                  </div>
                </div>
              </header>
              {/* Featured Image */}
              {post?.cover && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="rounded-md md:rounded-xl border overflow-hidden shadow-lg mb-8"
                >
                  <Image
                    src={urlFor(post.cover).url()}
                    alt={post.title}
                    width={1200}
                    height={600}
                    className="w-full h-72 object-cover"
                    priority
                  />
                </motion.div>
              )}

              {/* Article Content */}
              <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80 prose-code:before:hidden prose-code:after:hidden prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm">
                {post.content && (
                  <div className="prose max-w-none">
                    <PortableText
                      value={post.content as PortableTextBlock[]}
                      components={portableTextComponents}
                    />
                  </div>
                )}
              </article>

              {/* Article Footer */}
              <footer className="mt-5 md:mt-16 border-y py-4 md:py-8">
                <div className="flex flex-row justify-center sm:justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={liked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      className="flex items-center gap-2"
                    >
                      <FiHeart
                        className={`w-4 h-4 ${liked ? "fill-current" : ""}`}
                      />
                      <span>{likes} Likes</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        navigator.clipboard.writeText(currentUrl);
                        toast.success("Link copied!");
                      }}
                    >
                      <FiShare2 className="w-4 h-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                  <Button
                    variant={bookmarked ? "default" : "outline"}
                    size="sm"
                    onClick={handleBookmark}
                    className="flex items-center gap-2"
                  >
                    <FiBookmark
                      className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`}
                    />
                    <span>{bookmarked ? "Saved" : "Save"}</span>
                  </Button>
                </div>
              </footer>
            </motion.div>

            {/* Newsletter Signup */}
            <div className="my-5 md:my-10">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Action Buttons */}
      {showFloatingActions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
        >
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-lg size-12"
            onClick={() => {
              navigator.clipboard.writeText(currentUrl);
              toast.success("Link copied!");
            }}
          >
            <FiShare2 className="size-5" />
          </Button>
          <Button
            size="icon"
            className="rounded-full shadow-lg size-12"
            onClick={handleLike}
          >
            <FiHeart className={`size-5 ${liked ? "fill-current" : ""}`} />
          </Button>
        </motion.div>
      )}
    </>
  );
}
