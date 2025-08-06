"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

interface KeyMomentsProps {
  images: string[];
  keyMomentsData: Array<{
    image: string;
    title?: string;
    description?: string;
  }>;
}

export function KeyMoments({ images, keyMomentsData }: KeyMomentsProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("🤩 Captured moments");

  if (!images || images.length === 0) return null;

  return (
    <section className="my-8">
      <h3 className="font-semibold text-lg mb-4"># Key Moments</h3>
      <div className="flex gap-4 overflow-auto pb-4 w-fu">
        {images.map((img, idx) => {
          const momentData = keyMomentsData[idx];
          return (
            <Dialog key={img}>
              <DialogTrigger asChild>
                <button
                  className="flex w-60 h-60 md:w-80 md:h-80 p-1 border rounded-md hover:shadow-lg transition-all duration-300 overflow-hidden bg-muted cursor-pointer"
                  onClick={() => {
                    setSelected(img);
                    setSelectedDescription(momentData?.description || "");
                    setSelectedTitle(
                      momentData?.title || "🤩 Captured moments"
                    );
                  }}
                >
                  <Image
                    src={img}
                    alt={momentData?.title || `Key moment ${idx + 1}`}
                    width={800}
                    height={800}
                    className="object-cover w-full h-full rounded-md"
                  />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedTitle}</DialogTitle>
                  {selectedDescription && (
                    <DialogDescription className="text-base">
                      {selectedDescription}
                    </DialogDescription>
                  )}
                </DialogHeader>
                {selected && (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={selected}
                      alt={selectedTitle}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </section>
  );
}
