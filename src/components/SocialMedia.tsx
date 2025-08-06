"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import {
  TbBrandLinkedin,
  TbBrandGithub,
  TbBrandInstagram,
  TbBrandX,
  TbBrandThreads,
  TbBrandYoutube,
} from "react-icons/tb";
import Link from "next/link";

const socialLinks = [
  {
    icon: TbBrandLinkedin,
    href: "https://www.linkedin.com/in/vinayak-gore-b85b7922a/",
  },
  { icon: TbBrandGithub, href: "https://github.com/TheVinayakGore" },
  {
    icon: TbBrandInstagram,
    href: "https://www.instagram.com/vinugoredev/?igsh=cjBrcjNuY21zcWw2",
  },
  { icon: TbBrandX, href: "https://x.com/vinugoredev" },
  {
    icon: TbBrandThreads,
    href: "https://www.facebook.com/profile.php?id=61561190855256&mibextid=ZbWKwL",
  },
  {
    icon: TbBrandYoutube,
    href: "https://www.facebook.com/profile.php?id=61561190855256&mibextid=ZbWKwL",
  },
];

const SocialMedia = () => {
  return (
    <>
      <div className="flex gap-1 md:gap-3">
        {socialLinks.map((social, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="icon" asChild className="p-4 md:p-5">
              <Link
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="size-5 md:size-6" />
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SocialMedia;
