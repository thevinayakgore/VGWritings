import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div className="bg-primary/5 p-5 md:p-8 rounded-md md:rounded-xl hover:shadow-lg full">
      <h2 className="logo text-2xl font-bold mb-2">Subscribe to our Newsletter</h2>
      <p className="mb-4 text-xs md:text-sm text-muted-foreground">
        Get the latest posts delivered right to your inbox.
      </p>
      {submitted ? (
        <div className="text-green-600 font-medium">
          Thank you for subscribing!
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 p-2 px-4 md:p-5 border-primary/30 text-sm md:text-base"
          />
          <Button type="submit" size="lg" className="shrink-0 p-5">
            Subscribe
          </Button>
        </form>
      )}
    </div>
  );
}
