"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiUsers, FiCalendar, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { FiChevronsRight } from "react-icons/fi";
import blogData from "@/data/blog-data.json";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function MyTravels() {
  const [displayCount, setDisplayCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  // Convert blog data to trips format
  const trips = Object.entries(blogData).map(([slug, blog]) => ({
    title: blog.title,
    period: blog.date,
    description: blog.description,
    image: blog.cover,
    highlights: blog.highlights || [],
    stats: {
      travelers: (blog.id % 4) + 2, // Deterministic based on blog ID
      days: parseInt(blog.readTime.split(" ")[0]) || 5,
      landmarks: blog.images?.length || 0,
    },
    slug: slug,
  }));

  const displayedTrips = trips.slice(0, displayCount);
  const hasMoreTrips = displayCount < trips.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + 3, trips.length));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-10 md:py-28 px-4 bg-gradient-to-br from-sky-500/30 to-violet-500/30 dark:from-primary/20 dark:to-gray-900">
      <div className="container m-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="logo text-4xl md:text-6xl font-bold pb-5 bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent dark:from-yellow-300 dark:to-purple-400">
            My Travelling Diaries
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            A glimpse into my journeys across India, capturing memories,
            culture, and adventure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {displayedTrips.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                boxShadow: "0 8px 32px rgba(80, 80, 200, 0.15)",
              }}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg md:shadow-xl dark:shadow-black/30 overflow-hidden flex flex-col transition-transform hover:scale-105 duration-300"
            >
              <div className="relative w-full h-40 md:h-60">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={2000}
                  height={2000}
                  className="object-cover object-top w-full h-full"
                />
                <span className="absolute top-4 left-4 bg-white/80 text-black px-3 py-1 rounded-full text-xs font-semibold shadow">
                  {item.period}
                </span>
              </div>
              <div className="p-3 md:p-5 flex flex-col flex-1 w-full">
                <h1 className="logo text-2xl font-bold mb-2">{item.title}</h1>
                <p className="text-xs md:text-sm text-foreground/70 dark:text-zinc-300 mb-4">
                  {item.description}
                </p>
                <ul className="mb-4 space-y-2">
                  {item.highlights.slice(0, 3).map((highlight, i) => (
                    <li
                      key={i}
                      className="flex items-center text-xs md:text-sm text-foreground/80 dark:text-zinc-200"
                    >
                      <FiCheckCircle className="size-4 text-green-500 dark:text-green-400 mr-2" />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between bg-gradient-to-r from-orange-50 to-violet-50 dark:from-zinc-800 dark:to-zinc-950 dark:shadow-lg rounded-lg p-3 mt-auto">
                  <div className="flex items-center gap-1 text-sm text-foreground/80 dark:text-zinc-200">
                    <FiUsers className="h-4 w-4 text-orange-500" />{" "}
                    {item.stats.travelers} Travelers
                  </div>
                  <div className="flex items-center gap-1 text-sm text-foreground/80 dark:text-zinc-200">
                    <FiCalendar className="h-4 w-4 text-orange-500" />{" "}
                    {item.stats.days} Days
                  </div>
                  <div className="flex items-center gap-1 text-sm text-foreground/80 dark:text-zinc-200">
                    <FiMapPin className="h-4 w-4 text-orange-500" />{" "}
                    {item.stats.landmarks} Landmarks
                  </div>
                </div>
                <Link
                  href={`/blogs/${item.slug}`}
                  className="mt-6 p-2 px-4 rounded-lg bg-primary/5 font-medium border hover:bg-primary/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center gap-2 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  aria-label={`Read blog post about ${item.title}`}
                >
                  Start Reading
                  <FiChevronsRight className="size-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Load More Button */}
      {hasMoreTrips && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10 md:mt-28"
        >
          <Button
            onClick={handleLoadMore}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white p-4 md:p-7 px-7 md:px-10 text-sm md:text-base rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Load More Blogs
          </Button>
        </motion.div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mt-10 md:mt-28"
        >
          <div className="flex items-center justify-center gap-3 text-orange-500">
            <Loader2 className="size-6 animate-spin" />
            <span className="text-base md:text-lg font-medium">
              Loading more blogs...
            </span>
          </div>
        </motion.div>
      )}
    </section>
  );
}
