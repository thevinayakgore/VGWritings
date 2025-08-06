"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import SocialMedia from "./SocialMedia";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t px-4">
      <div className="container py-6 md:py-12 m-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-2 md:mb-4">
              <span className="logo text-xl md:text-2xl font-bold text-primary">
                VGWritings
              </span>
            </Link>
            <p className="text-sm md:text-base text-foreground/80 mb-3 md:mb-6">
              A platform for sharing knowledge, stories, and ideas that matter.
            </p>
            <SocialMedia />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-xs md:text-sm border-t mt-5 md:mt-12 pt-5 md:pt-8 text-center text-muted-foreground"
        >
          <p>© {currentYear} VGWritings. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
