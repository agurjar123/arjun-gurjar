import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import FavoriteItem from "@/components/favorites/FavoriteItem";

export const metadata: Metadata = {
  title: "Favorites — Arjun Gurjar",
  description: "Favorite books and movies",
};

const books = [
  { title: "Gödel, Escher, Bach", creator: "Douglas Hofstadter", note: "A strange loop of a book" },
  { title: "The Brothers Karamazov", creator: "Fyodor Dostoevsky", note: "Questions without answers" },
  { title: "The Hitchhiker's Guide to the Galaxy", creator: "Douglas Adams" },
  { title: "Surely You're Joking, Mr. Feynman!", creator: "Richard Feynman", note: "Curiosity as a way of life" },
  { title: "Siddhartha", creator: "Hermann Hesse" },
  { title: "The Selfish Gene", creator: "Richard Dawkins" },
  { title: "Piranesi", creator: "Susanna Clarke" },
];

const movies = [
  { title: "Interstellar", creator: "Christopher Nolan", note: "Still thinking about the bookshelf" },
  { title: "Blade Runner 2049", creator: "Denis Villeneuve" },
  { title: "Eternal Sunshine of the Spotless Mind", creator: "Michel Gondry" },
  { title: "2001: A Space Odyssey", creator: "Stanley Kubrick" },
  { title: "Princess Mononoke", creator: "Hayao Miyazaki" },
  { title: "Her", creator: "Spike Jonze" },
  { title: "Arrival", creator: "Denis Villeneuve", note: "Language shapes thought" },
];

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
          <p className="text-xs text-slate-400 mb-4">In no particular order</p>
          {books.map((book) => (
            <FavoriteItem key={book.title} {...book} />
          ))}
        </Card>

        <Card>
          <h2 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pastel-green inline-block" />
            Movies
          </h2>
          <p className="text-xs text-slate-400 mb-4">In no particular order</p>
          {movies.map((movie) => (
            <FavoriteItem key={movie.title} {...movie} />
          ))}
        </Card>
      </div>
    </Container>
  );
}
