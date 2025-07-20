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
import type { PortableTextBlock } from "@portabletext/types";

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
              className="flex flex-col lg:flex-row items-start bg-background p-5 md:p-8 border rounded-lg mb-8"
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
                className="md:pl-10 h-full lg:w-1/2"
              >
                <h1 className="logo text-4xl md:text-6xl font-bold mb-5">
                  {item.title}
                </h1>

                <div className="text-base md:text-lg text-muted-foreground mb-6">
                  {item.content && (
                    <div className="prose max-w-none mb-2">
                      <PortableText value={item.content} />
                    </div>
                  )}
                </div>

                <ul className="pl-0 mb-6 text-muted-foreground">
                  {item.features &&
                    item.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 mb-2">
                        <FiCheckCircle className="size-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                </ul>

                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <Link href={item.firstBtn}>Start Reading</Link>
                  </Button>

                  <Button variant="outline" asChild>
                    <Link href={item.secondBtn}>Contact Me</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
