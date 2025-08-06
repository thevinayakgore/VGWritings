"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";
import { client } from "@/sanity/lib/client";
import { toast } from "sonner";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import SocialMedia from "./SocialMedia";

// Custom components for PortableText with proper typing
const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-sm md:text-base text-muted-foreground">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mb-5">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mb-4">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 space-y-2 mb-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-2 mb-4">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-primary">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => (
      <u className="underline decoration-primary">{children}</u>
    ),
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <Link
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-primary hover:underline"
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => (
      <div className="my-6">
        <Image
          src={urlFor(value).url()}
          alt={value.alt || " "}
          width={800}
          height={600}
          className="rounded-lg shadow-lg"
        />
        {value.caption && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {value.caption}
          </p>
        )}
      </div>
    ),
  },
};

type About = {
  _id: string;
  title: string;
  image: { asset: { _ref: string; _type: string }; _type: string } | null;
  content: PortableTextBlock[];
  features: string[];
  firstBtn: string;
  secondBtn: string;
};

export default function AboutSection() {
  const [about, setAbout] = useState<About[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      setLoading(true);
      try {
        const data = await client.fetch(
          `*[_type == "about"]{
            _id,
            title,
            image,
            content,
            features,
            firstBtn,
            secondBtn,
          }`
        );
        setAbout(data);
      } catch {
        setAbout([]);
        toast("Failed to fetch about", {
          description:
            "There was an error fetching about info. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  return (
    <section id="about" className="py-20 md:py-40 px-4">
      <div className="max-w-6xl m-auto items-start p-3 bg-primary/5 shadow-xl border rounded-lg w-full">
        {loading ? (
          <div>Loading about info...</div>
        ) : about.length === 0 ? (
          <div>No about info found.</div>
        ) : (
          about.map((item) => (
            <div
              key={item._id}
              className="flex flex-col lg:flex-row items-start bg-background p-5 md:p-8 border rounded-lg"
            >
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="mb-7 lg:mb-0 md:pr-10 md:border-r-[1.5px] border-dashed lg:w-1/2"
              >
                <div className="relative w-full rounded-lg overflow-hidden">
                  {item.image && item.image.asset && (
                    <Image
                      src={urlFor(item.image).url()}
                      alt={item.title}
                      width={2000}
                      height={2000}
                      className="object-cover w-full"
                    />
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col items-center md:items-start md:pl-10 h-full lg:w-1/2"
              >
                <h1 className="logo text-left text-3xl md:text-6xl font-bold mb-3 md:mb-5 w-full">
                  {item.title}
                </h1>

                <div className="text-base md:text-lg text-muted-foreground mb-3 md:mb-6">
                  {item.content && (
                    <div className="prose max-w-none mb-2">
                      <PortableText
                        value={item.content}
                        components={portableTextComponents}
                      />
                    </div>
                  )}
                </div>

                <ul className="pl-0 space-y-2 text-muted-foreground">
                  {item.features &&
                    item.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm md:text-base"
                      >
                        <FiCheckCircle className="text-primary" />
                        {feature}
                      </li>
                    ))}
                </ul>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 w-full">
                  <Button
                    asChild
                    className="p-6 md:px-10 font-normal text-base hover:scale-110 transition-all duration-500"
                  >
                    <Link href={item.firstBtn}>Start Reading</Link>
                  </Button>

                  <Button
                    variant="outline"
                    asChild
                    className="p-6 md:px-10 font-normal text-base hover:scale-110 transition-all duration-500"
                  >
                    <Link href={item.secondBtn}>Travelling Blogs</Link>
                  </Button>
                </div>

                <SocialMedia />
              </motion.div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
