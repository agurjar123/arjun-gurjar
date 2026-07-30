import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Chrome for the main public site. Backstage lives outside this group and has
// its own layout, so it renders without this Navbar/Footer.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
