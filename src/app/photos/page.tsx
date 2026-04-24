import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Photos — Arjun Gurjar",
  description: "Photos I've taken",
};

type Photo = {
  src: string;
  alt: string;
  caption?: string;
};

const travel: Photo[] = [
  { src: "/images/photos/taj-mahal.jpg",      alt: "Taj Mahal", caption: "Agra, India" },
  { src: "/images/photos/eiffel-tower.jpg",   alt: "Eiffel Tower at sunset", caption: "Paris" },
  { src: "/images/photos/lincoln-center.jpg", alt: "Lincoln Center", caption: "New York City" },
];

const bayArea: Photo[] = [
  { src: "/images/photos/golden-gate.jpg",         alt: "Golden Gate Bridge at sunset", caption: "Golden Gate, San Francisco" },
  { src: "/images/photos/bay-area-sunset.jpg",     alt: "Bay Area at sunset from the hills", caption: "Mission Peak, Fremont" },
  { src: "/images/photos/berkeley-night.jpg",      alt: "Berkeley and Bay at night", caption: "Berkeley Hills" },
  { src: "/images/photos/friends-sunset.jpg",      alt: "Friends watching the sunset at a pier", caption: "Berkeley Marina" },
];

const nature: Photo[] = [
  { src: "/images/photos/sunset-above-clouds.jpg", alt: "Sunset above a cloud layer" },
  { src: "/images/photos/lake-reflection.jpg",     alt: "Lake reflection at dusk" },
  { src: "/images/photos/waterfall.jpg",           alt: "Waterfall in a forest" },
  { src: "/images/photos/clouds.jpg",              alt: "Dramatic cumulus clouds" },
];

const macro: Photo[] = [
  { src: "/images/photos/yellow-flower.jpg",   alt: "Yellow flower against blue sky" },
  { src: "/images/photos/wildflowers.jpg",     alt: "Red wildflowers" },
  { src: "/images/photos/purple-flowers.jpg",  alt: "Purple flower cluster" },
];

function PhotoGrid({ photos }: { photos: Photo[] }) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-3 space-y-3">
      {photos.map((photo) => (
        <div
          key={photo.src}
          className="relative break-inside-avoid rounded-2xl overflow-hidden border border-surface-border group"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={800}
            height={600}
            className="w-full h-auto block"
            style={{ display: "block" }}
          />
          {photo.caption && (
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium">{photo.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Section({ title, photos }: { title: string; photos: Photo[] }) {
  return (
    <section className="mb-14">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">
        {title}
      </h2>
      <PhotoGrid photos={photos} />
    </section>
  );
}

export default function PhotosPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        title="Photos"
        subtitle="Things I've seen and wanted to hold onto."
      />
      <Section title="Travel" photos={travel} />
      <Section title="Bay Area" photos={bayArea} />
      <Section title="Nature" photos={nature} />
      <Section title="Macro" photos={macro} />
    </Container>
  );
}
