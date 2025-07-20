"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { FiArrowRight } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center py-20 md:py-40 px-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container relative z-20 flex flex-col items-center text-center m-auto w-full"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="logo text-3xl md:text-5xl lg:text-7xl font-bold tracking-wider mb-6"
        >
          Vinayak Gore
        </motion.h1>

        <motion.h1
          initial={{ opacity: 1 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1.2, duration: 1.8 }}
          className="writings text-8xl md:text-[10rem] lg:text-[15rem] mt-4 md:mt-10 mb-10 md:mb-24"
        >
          Writings
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-foreground/80 max-w-3xl mb-8"
        >
          Discover insightful articles, creative stories, and expert knowledge
          shared by our community of writers and thinkers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button asChild size="lg">
            <Link href="/blog">
              Explore Blog
              <FiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="#featured">Featured Posts</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
