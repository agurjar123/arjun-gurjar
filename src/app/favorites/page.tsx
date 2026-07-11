import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Favorite books and movies",
};

export default function FavoritesPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Coming soon"
        title="Favorites"
        subtitle="Books and films that have stayed with me."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-serif text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            Books
          </h2>
          <p className="font-mono text-xs uppercase tracking-wider text-faint mt-4">Coming soon</p>
        </Card>

        <Card>
          <h2 className="font-serif text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-muted inline-block" />
            Movies
          </h2>
          <p className="font-mono text-xs uppercase tracking-wider text-faint mt-4">Coming soon</p>
        </Card>
      </div>
    </Container>
  );
}
