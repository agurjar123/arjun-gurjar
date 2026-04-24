import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Favorites — Arjun Gurjar",
  description: "Favorite books and movies",
};

export default function FavoritesPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        title="Favorites"
        subtitle="Books and films that have stayed with me."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pastel-blue inline-block" />
            Books
          </h2>
          <p className="text-xs text-slate-400 mt-4">Coming soon.</p>
        </Card>

        <Card>
          <h2 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pastel-green inline-block" />
            Movies
          </h2>
          <p className="text-xs text-slate-400 mt-4">Coming soon.</p>
        </Card>
      </div>
    </Container>
  );
}
