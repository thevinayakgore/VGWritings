"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiInstagram, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { FiGithub, FiFacebook } from "react-icons/fi";
import { Button } from "./ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { icon: FiGithub, href: "https://github.com/TheVinayakGore" },
    {
      icon: FiLinkedin,
      href: "https://www.linkedin.com/in/vinayak-gore-b85b7922a/",
    },
    {
      icon: FiInstagram,
      href: "https://www.instagram.com/vinugoredev/?igsh=cjBrcjNuY21zcWw2",
    },
    {
      icon: FiFacebook,
      href: "https://www.facebook.com/profile.php?id=61561190855256&mibextid=ZbWKwL",
    },
    { icon: FaXTwitter, href: "https://x.com/vinugoredev" },
  ];

  return (
    <footer className="bg-background border-t px-4">
      <div className="container py-12 m-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="logo text-2xl font-bold text-primary">
                VGWritings
              </span>
            </Link>
            <p className="text-foreground/80 mb-6">
              A platform for sharing knowledge, stories, and ideas that matter.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <social.icon className="size-5" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-sm border-t mt-12 pt-8 text-center text-muted-foreground"
        >
          <p>© {currentYear} VGWritings. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
