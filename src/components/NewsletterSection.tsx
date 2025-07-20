"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FiMail } from "react-icons/fi";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      <span>
        <b>Subscribed!</b>
        <br />
        Thank you for subscribing to our newsletter.
      </span>
    );
    setEmail("");
  };

  return (
    <section
      id="newsletter"
      className="py-20 md:py-40 px-4 bg-gradient-to-tr from-primary/10"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="logo text-4xl md:text-6xl font-bold mb-5">
            Stay Updated
          </h2>
          <p className="text-lg text-foreground/80 mb-8">
            Subscribe to our newsletter to get the latest articles and updates
            delivered straight to your inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row relative"
          >
            <div className=" flex-grow">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-primary" />
              <Input
                type="email"
                placeholder="Your email address"
                className="pl-10 py-6 border-primary/50 placeholder:text-primary rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="absolute right-0 m-[0.32rem] rounded"
            >
              Subscribe
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
