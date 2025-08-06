"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GrSun } from "react-icons/gr";
import { PiMoon } from "react-icons/pi";
import Image from "next/image";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "General", href: "/general" },
    { name: "Learning", href: "/#learning" },
    { name: "About", href: "/#about" },
  ];

  return (
    <nav className="sticky top-0 z-[100] block w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex p-4 items-center justify-between mx-auto w-full">
        <Link href="/" className="inline-flex items-center gap-2 md:gap-3">
          <Image
            src="/logo.jpg"
            alt="logo"
            width={100}
            height={100}
            className="size-7 md:size-9 rounded-full"
          />
          <span className="logo text-xl md:text-2xl font-bold text-primary">
            VGWritings
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? (
                <GrSun className="h-5 w-5" />
              ) : (
                <PiMoon className="h-5 w-5" />
              )
            ) : (
              <GrSun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Subnavbar for mobile only */}
      <div className="sticky top-0 block md:hidden border-dashed border-y w-full">
        <div className="container mx-auto flex justify-around p-4 w-full">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
