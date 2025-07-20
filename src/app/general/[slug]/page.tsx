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
  FiMessageCircle,
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "sonner";
import CodeBlock from "@/components/CodeBlock";
import VideoPlayer from "@/components/VideoPlayer";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { PortableTextBlock } from "@portabletext/types";
import TableOfContents, { TocItem } from "@/components/TableOfContents";
import NewsletterSignup from "@/components/NewsletterSignup";
import { motion } from "framer-motion";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

type SanityImage = {
  asset: { _ref: string; _type: string };
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
    | {
        _type: "keyMoments";
        image: SanityImage;
        title?: string;
        description?: string;
      }
  >;
};

function KeyMoments({
  images,
  keyMomentsData,
}: {
  images: string[];
  keyMomentsData: { image: string; title: string; description: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [selectedTitle, setSelectedTitle] = useState<string>(
    "🤩 Captured moments"
  );

  if (!Array.isArray(images) || images.length === 0) return null;

  return (
    <section className="overflow-x-auto w-full">
      <h3 className="font-semibold text-lg mb-2"># Key Moments :</h3>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className="flex gap-3 overflow-x-auto p-5 md:p-10 md:pt-5 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/30"
          asChild
        >
          <div>
            {images.map((img, idx) => (
              <button
                key={img + idx}
                type="button"
                className="shrink-0 md:mt-3 -rotate-6 z-0 hover:rotate-0 hover:z-10 w-auto h-40 md:h-64 p-1 md:p-1.5 border rounded md:rounded-md hover:shadow-lg transition-all hover:scale-110 duration-300 overflow-hidden bg-muted cursor-pointer"
                onClick={() => {
                  setSelected(img);
                  const momentData = keyMomentsData.find(
                    (moment) => moment.image === img
                  );
                  setSelectedDescription(
                    momentData?.description ||
                      "A memorable moment from the journey !"
                  );
                  setSelectedTitle(
                    momentData?.title
                      ? `${momentData.title}`
                      : "🤩 Captured moments"
                  );
                  setOpen(true);
                }}
              >
                <Image
                  src={img}
                  alt={`Key moment ${idx + 1}`}
                  width={2000}
                  height={2000}
                  className="object-cover rounded md:rounded-md w-full h-full"
                />
              </button>
            ))}
          </div>
        </DialogTrigger>
        <DialogContent className="mt-16 md:mt-10 p-1.5 md:p-6 max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              {selectedTitle}
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base leading-relaxed">
              {selectedDescription}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <Image
              src={selected}
              alt="Large key moment"
              width={1200}
              height={800}
              className="rounded-md md:rounded-lg w-full h-full"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default function GeneralBlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<GeneralPost | null>(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showFloatingActions, setShowFloatingActions] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [related, setRelated] = useState<GeneralPost[]>([]);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      const data = await client.fetch(
        `*[_type == "general" && slug.current == $slug][0]{
          _id,
          title,
          slug,
          date,
          desc,
          category,
          readingTime,
          coverImage,
          likes,
          comments,
          tags,
          content[]{
            ...,
            file{ asset->{ url } },
            poster{ asset->{ url } }
          }
        }`,
        { slug }
      );
      setPost(data);
      setLikes(data?.likes ?? 0);
    };
    fetchPost();
  }, [slug]);

  // Extract key moments from content (move above useEffect)
  const keyMomentsBlocks = Array.isArray(post?.content)
    ? post.content.filter(isKeyMomentBlock)
    : [];
  const keyMomentsData = keyMomentsBlocks.map((block) => ({
    image: urlFor(block.image).url(),
    title: block.title || "",
    description: block.description || "",
  }));
  const keyMomentImages = keyMomentsData.map((km) => km.image);

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
      // Add Key Moments to TOC if present
      if (keyMomentImages.length > 0) {
        headings.push({
          id: "key-moments",
          text: "Key Moments",
          level: 2,
        });
      }
      setTocItems(headings);
    }
  }, [slug, post?.content, keyMomentImages.length]);

  useEffect(() => {
    // Fetch related posts (same category, exclude current slug)
    if (!post) return;
    const fetchRelated = async () => {
      const data = await client.fetch(
        `*[_type == "general" && category == $category && slug.current != $slug][0...6]{
          _id,
          title,
          slug,
          date,
          desc,
          category,
          readingTime,
          coverImage,
          likes,
          comments,
          tags,
        }`,
        { category: post.category, slug: post.slug.current }
      );
      setRelated(data);
    };
    fetchRelated();
  }, [post]);

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
        <ul className="list-none text-xs leading-5 md:leading-7 md:text-base p-5">
          {props.children}
        </ul>
      ),
      number: (props: { children?: React.ReactNode }) => (
        <ol className="list-decimal pl-5 text-xs leading-5 md:leading-7 md:text-base p-5">
          {props.children}
        </ol>
      ),
      square: (props: { children?: React.ReactNode }) => (
        <ul className="list-square pl-5 text-purple-500 p-5">
          {props.children}
        </ul>
      ),
      circle: (props: { children?: React.ReactNode }) => (
        <ul className="list-circle pl-5 text-green-400 p-5">
          {props.children}
        </ul>
      ),
      alpha: (props: { children?: React.ReactNode }) => (
        <ol className="list-[lower-alpha] pl-5 text-pink-400 p-5">
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
          <FiCheckCircle className="text-green-500" />
          {props.children}
        </li>
      ),
    },
    marks: {
      link: (props: {
        children?: React.ReactNode;
        value?: { href?: string };
      }) => {
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

  // Type guard for keyMoments block
  function isKeyMomentBlock(block: unknown): block is {
    _type: "keyMoments";
    image: SanityImage;
    title?: string;
    description?: string;
  } {
    const b = block as Record<string, unknown>;
    return (
      !!b &&
      b._type === "keyMoments" &&
      typeof b.image === "object" &&
      b.image !== null
    );
  }

  return (
    <>
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
                <Link href="/general">
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
                {post.desc && (
                  <p className="text-sm md:text-lg text-muted-foreground mb-3">
                    {post.desc}
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
                      <span>{post.readingTime} min read</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FiMessageCircle className="size-4" />
                    <span>{post.comments ?? 0} Comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiHeart className="size-4" />
                    <span>{likes} Likes</span>
                  </div>
                </div>
              </header>
              {/* Featured Image */}
              {post.coverImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="rounded-md md:rounded-xl border overflow-hidden shadow-lg my-6 md:my-12"
                >
                  <Image
                    src={urlFor(post.coverImage).url()}
                    alt={post.title}
                    width={1200}
                    height={600}
                    className="w-full h-96 object-cover"
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
                {/* Key Moments Section */}
                {keyMomentImages.length > 0 && (
                  <div id="key-moments">
                    <KeyMoments
                      images={keyMomentImages}
                      keyMomentsData={keyMomentsData}
                    />
                  </div>
                )}
              </article>

              {/* Article Footer */}
              <footer className="mt-5 md:mt-16 border-y py-4 md:py-8">
                <div className="flex flex-row justify-center sm:justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FiMessageCircle className="w-4 h-4" />
                      <span>{post.comments ?? 0} Comments</span>
                    </div>
                    <span className="flex items-center gap-2">
                      <FiHeart
                        onClick={handleLike}
                        className={`w-4 h-4 ${liked ? "fill-current" : ""}`}
                      />
                      <span>{likes} Likes</span>
                    </span>
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
            <div className="my-6 md:my-12">
              <NewsletterSignup />
            </div>

            {/* Related Articles */}
            {related && related.length > 0 && (
              <section className="my-6 md:my-12">
                <h2 className="logo text-lg md:text-4xl font-bold mb-5 md:mb-10">
                  🚀{" "}
                  <span className="underline underline-offset-8">
                    More articles you might like
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  {related.map((rel) => (
                    <motion.div
                      key={rel._id}
                      whileHover={{ y: -5 }}
                      className="bg-background border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <Link
                        href={`/general/${rel.slug.current}`}
                        className="block"
                      >
                        <div className="relative h-52 md:h-76 w-full">
                          {rel.coverImage && (
                            <Image
                              src={urlFor(rel.coverImage).url()}
                              alt={rel.title}
                              fill
                              className="object-cover object-top"
                            />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-2 p-3">
                            {rel.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                className="text-xs md:text-sm bg-primary rounded-full p-1 px-3"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="p-4 pt-0 sm:pt-2">
                            <h3 className="logo text-lg md:text-xl font-bold mb-2">
                              {rel.title}
                            </h3>
                            <p className="text-sm md:text-base text-muted-foreground line-clamp-2 mb-4">
                              {rel.desc}
                            </p>
                            <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <FiCalendar className="h-3 sm:h-4 w-3 sm:w-4" />
                                <span>
                                  {new Date(rel.date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FiClock className="h-3 sm:h-4 w-3 sm:w-4" />
                                <span>
                                  {rel.readingTime
                                    ? `${rel.readingTime} min read`
                                    : ""}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FiHeart className="h-3 sm:h-4 w-3 sm:w-4" />
                                <span>{rel.likes ?? 0} Likes</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FiMessageCircle className="h-3 sm:h-4 w-3 sm:w-4" />
                                <span>{rel.comments ?? 0} Comments</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <Link href="/general">
                  <Button size="lg" className="flex items-center gap-3 my-5">
                    <span>Explore more Blogs</span> <MdOutlineArrowRightAlt />
                  </Button>
                </Link>
              </section>
            )}
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
